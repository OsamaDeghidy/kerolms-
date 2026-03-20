import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await dbConnect();
    const comments = await Comment.find({ course: courseId, isActive: true })
      .populate("user", "name role")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, content, lessonId } = body;

    await dbConnect();
    const newComment = await Comment.create({
      user: session.user.id,
      course: courseId,
      lessonId,
      content,
      isAdmin: session.user.role === "admin"
    });

    return NextResponse.json(newComment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
