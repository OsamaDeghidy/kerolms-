"use server";

import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { auth } from "@/auth";

export async function getCourseBySlugAction(slug: string) {
  try {
    await dbConnect();
    const course = await Course.findOne({ slug }).lean();
    if (!course) return null;

    let isEnrolled = false;
    const session = await auth();
    
    if (session?.user) {
      // @ts-ignore
      const enrollment = await Enrollment.findOne({ user: session.user.id, course: course._id, status: "active" });
      isEnrolled = !!enrollment || session.user.role === "admin";
    }
    
    // Serialize MongoDB objects for Client Components
    return {
      ...JSON.parse(JSON.stringify(course)),
      isEnrolled
    };
  } catch (err) {
    console.error("Error fetching course:", err);
    return null;
  }
}

export async function getAllCoursesAction() {
  try {
    await dbConnect();
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(courses));
  } catch (err) {
    console.error("Error fetching all courses:", err);
    return [];
  }
}
