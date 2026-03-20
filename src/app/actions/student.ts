"use server";

import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import LiveSession from "@/models/LiveSession";
import Enrollment from "@/models/Enrollment";
import { auth } from "@/auth";

export async function getStudentDashboardAction() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return null;
    }

    await dbConnect();

    const enrollments = await Enrollment.find({ 
      // @ts-ignore
      user: session.user.id,
      status: "active" 
    }).populate("course").lean();

    const upcomingSessions = await LiveSession.find({ 
      startTime: { $gt: new Date() } 
    }).sort({ startTime: 1 }).limit(3).lean();

    return {
      user: {
        name: session.user.name,
        email: session.user.email,
        phone: (session.user as any).phone || "",
        role: session.user.role,
      },
      enrolledCourses: JSON.parse(JSON.stringify(enrollments)).map((e: any) => ({
        ...e.course,
        enrollmentId: e._id,
        progress: e.progress || 0,
      })),
      upcomingSessions: JSON.parse(JSON.stringify(upcomingSessions))
    };
  } catch (err) {
    console.error("Student Dashboard Data Error:", err);
    return null;
  }
}

export async function updateStudentProfileAction(formData: { name: string, phone: string, password?: string }) {
  try {
    const session = await auth();
    if (!session || !session.user) throw new Error("Unauthorized");

    await dbConnect();

    const updateData: any = {
      name: formData.name,
      phone: formData.phone
    };

    if (formData.password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(formData.password, 10);
    }

    // @ts-ignore
    await User.findByIdAndUpdate(session.user.id, updateData);

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
