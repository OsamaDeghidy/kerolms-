import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ valid: false, message: "No session" }, { status: 401 });
    }

    // @ts-ignore
    const { id, sessionToken, role } = session.user;

    // Admin accounts are exempt from single-session protection to facilitate management
    if (role === "admin") {
      return NextResponse.json({ valid: true });
    }

    await dbConnect();
    const user = await User.findById(id).select('sessionToken');

    if (!user || user.sessionToken !== sessionToken) {
      return NextResponse.json({ valid: false, message: "Session expired or logged in elsewhere" }, { status: 403 });
    }

    return NextResponse.json({ valid: true });
  } catch (err: any) {
    console.error("[VerifySession] Error:", err);
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}
