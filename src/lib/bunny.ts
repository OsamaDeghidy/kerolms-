import crypto from "crypto";

/**
 * Generates a signed token for Bunny.net Stream iframe embedding.
 * This prevents unauthorized sharing and hotlinking.
 * 
 * @param libraryId The Bunny Stream Library ID
 * @param videoId The Video ID
 * @param securityKey The Security Key (Token Authentication Key) from Bunny Dashboard
 * @param expirationTime Optional: Time in seconds until the token expires (default 1 hour)
 * @returns {string} The signed token
 */
export function generateBunnyToken(
  libraryId: string,
  videoId: string,
  securityKey: string,
  expirationTime: number = 3600
): string {
  const expires = Math.floor(Date.now() / 1000) + expirationTime;
  
  // Format: securityKey + videoId + expires
  const hashContent = `${securityKey}${videoId}${expires}`;
  const token = crypto.createHash("sha256").update(hashContent).digest("hex");
  
  return `${token}&expires=${expires}`;
}

/**
 * Generates the full iframe URL with security and watermarking.
 * 
 * @param videoId Bunny Video ID
 * @param studentName Name or ID of the student to display as watermark
 */
export function getSecureVideoUrl(videoId: string, studentName: string = "") {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID;
  const securityKey = process.env.BUNNY_SECURITY_KEY;

  if (!libraryId || !securityKey) {
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
  }

  const token = generateBunnyToken(libraryId, videoId, securityKey);
  
  // Base URL
  let url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}`;
  
  // Add watermark if provided (requires enabling Dynamic Watermarking in Bunny Dashboard)
  if (studentName) {
    url += `&watermark=${encodeURIComponent(studentName)}`;
  }

  return url;
}
