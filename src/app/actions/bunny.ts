"use server";

import { auth } from "@/auth";
import { getSecureVideoUrl } from "@/lib/bunny";

/**
 * Server Action to get a secure, signed URL for Bunny.net Stream.
 * Automatically includes student name as a watermark from the session.
 */
export async function getSecureAction(videoId: string) {
  const session = await auth();
  
  // Use student name/email for watermark to prevent recording
  const studentInfo = session?.user?.name || session?.user?.email || "Guest Student";
  
  const secureUrl = getSecureVideoUrl(videoId, studentInfo);
  
  return secureUrl;
}
