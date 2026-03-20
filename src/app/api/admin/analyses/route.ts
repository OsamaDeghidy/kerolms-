import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Analysis from "@/models/Analysis";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const analysis = await Analysis.create(body);
    return NextResponse.json(analysis, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const analyses = await Analysis.find({}).sort({ createdAt: -1 });
    return NextResponse.json(analyses);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
