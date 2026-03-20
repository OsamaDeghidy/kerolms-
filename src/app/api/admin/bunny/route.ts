import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";

const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const API_KEY = process.env.BUNNY_STREAM_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    // 1. Create Video Object in Bunny Stream
    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      return NextResponse.json({ error: err.message || "Failed to create video" }, { status: createRes.status });
    }

    const videoData = await createRes.json();
    const videoId = videoData.guid;

    // 2. Generate Signature for TUS/Direct Upload
    // Format: sha256(libraryId + apiKey + expirationTime + videoId)
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    return NextResponse.json({
      videoId,
      libraryId: LIBRARY_ID,
      apiKey: API_KEY, // Pass for direct upload
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET status of a video
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const statusRes = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
      {
        headers: { AccessKey: API_KEY! },
      }
    );

    if (!statusRes.ok) {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: statusRes.status });
    }

    const data = await statusRes.ok ? await statusRes.json() : {};
    
    // Status codes: 0 = Queued, 1 = Processing, 2 = Encoding, 3 = Finished, 4 = ResolutionFinished, 5 = Failed, 6 = PresignedUploadStarted, 7 = PresignedUploadFinished, 8 = PresignedUploadFailed
    return NextResponse.json({
      status: data.status,
      percentage: data.encodeProgress,
      isFinished: data.status === 4 || data.status === 3
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
