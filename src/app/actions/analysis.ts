"use server";

import dbConnect from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import { auth } from "@/auth";

export async function getAnalysesAction() {
  try {
    const session = await auth();
    // @ts-ignore
    const hasAccess = session?.user?.hasAnalysisAccess || session?.user?.role === "admin";
    
    if (!hasAccess) return [];

    await dbConnect();
    const analyses = await Analysis.find({ isActive: true }).sort({ scheduledAt: -1, createdAt: -1 }).lean();
    
    return JSON.parse(JSON.stringify(analyses));
  } catch (err) {
    console.error("Error fetching analyses:", err);
    return [];
  }
}

export async function getLiveAnalysisAction() {
  try {
    await dbConnect();
    const live = await Analysis.findOne({ isLive: true, isActive: true }).lean();
    return live ? JSON.parse(JSON.stringify(live)) : null;
  } catch (err) {
    return null;
  }
}
