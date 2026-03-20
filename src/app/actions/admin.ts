"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import LiveSession from "@/models/LiveSession";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function getAdminStatsAction() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const [totalStudents, totalCourses, upcomingSessionsCount, pendingOrdersCount, recentUsers, revenueData] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({}),
      LiveSession.countDocuments({ startTime: { $gt: new Date() } }),
      Order.countDocuments({ status: "pending" }),
      User.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    return {
      totalStudents,
      totalCourses,
      upcomingSessionsCount,
      pendingOrdersCount,
      recentUsers: JSON.parse(JSON.stringify(recentUsers)),
      totalRevenue: revenueData[0]?.total || 0 
    };
  } catch (err) {
    console.error("Admin Stats Error:", err);
    return null;
  }
}
