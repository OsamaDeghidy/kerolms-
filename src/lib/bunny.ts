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
/**
 * Generates a signed token for Bunny.net Stream iframe embedding.
 * This prevents unauthorized sharing and hotlinking.
 * IMPORTANT: If watermarking is used, it MUST be part of the hash.
 */
export function generateBunnyToken(
  videoId: string,
  securityKey: string,
  expirationTime: number = 3600,
  watermark: string = ""
): { token: string; expires: number } {
  const expires = Math.floor(Date.now() / 1000) + expirationTime;
  
  // Format based on Bunny Docs: sha256(securityKey + videoId + expires + watermark)
  // Watermark is optional but mandatory if used in the actual URL
  const hashContent = `${securityKey}${videoId}${expires}${watermark}`;
  const token = crypto.createHash("sha256").update(hashContent).digest("hex");
  
  return { token, expires };
}

/**
 * Generates the full iframe URL with security and watermarking.
 * 
 * @param videoId Bunny Video ID
 * @param studentName Name or ID of the student to display as watermark
 */
export function getSecureVideoUrl(videoId: string, studentName: string = "") {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID || process.env.BUNNY_STREAM_LIBRARY_ID;
  const securityKey = process.env.BUNNY_SECURITY_KEY;

  // Diagnostics for Vercel Logs (Server-side)
  if (!libraryId) {
    console.error("❌ [BUNNY_DEBUG] Library ID is missing from Env Vars.");
  }
  if (!securityKey) {
    console.warn("⚠️ [BUNNY_DEBUG] Security Key is missing. Signed URLs will fail.");
  }

  // Base fallback if Library ID is missing to avoid 404 on "undefined"
  if (!libraryId) {
    return ""; 
  }

  // Use the name for watermark. If none, don't sign for one.
  const watermarkText = studentName || "";

  // If no security key is provided, return direct iframe URL (only works if Token Auth is DISABLED in Bunny)
  if (!securityKey) {
    let fallbackUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=0`;
    if (watermarkText) fallbackUrl += `&watermark=${encodeURIComponent(watermarkText)}`;
    return fallbackUrl;
  }

  const { token, expires } = generateBunnyToken(videoId, securityKey, 3600, watermarkText);
  
  // Official URL Format: /embed/LIBRARY_ID/VIDEO_ID?token=SIGNATURE&expires=TIMESTAMP
  let url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=0`;
  
  // Add watermark if provided (MUST match what was signed)
  if (watermarkText) {
    url += `&watermark=${encodeURIComponent(watermarkText)}`;
  }

  return url;
}
