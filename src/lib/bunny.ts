import crypto from "crypto";

/**
 * Generates a signed token for Bunny.net Stream iframe embedding.
 * This prevents unauthorized sharing and hotlinking.
 * 
 * Signature Algorithm: sha256(securityKey + videoId + expires)
 */
export function generateBunnyToken(
  videoId: string,
  securityKey: string,
  expirationTime: number = 3600
): { token: string; expires: number } {
  const expires = Math.floor(Date.now() / 1000) + expirationTime;
  const hashContent = `${securityKey}${videoId}${expires}`;
  const token = crypto.createHash("sha256").update(hashContent).digest("hex");
  
  return { token, expires };
}

/**
 * Generates the full iframe URL with security.
 * Ensure your Library ID and Security Key are set in .env
 * 
 * @param videoId Bunny Video ID
 * @param studentName Optional: Name of the student for future watermarking
 */
export function getSecureVideoUrl(videoId: string, studentName: string = "") {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID || process.env.BUNNY_STREAM_LIBRARY_ID;
  const securityKey = process.env.BUNNY_SECURITY_KEY;

  if (!libraryId) {
    console.error("❌ BUNNY_STREAM_LIBRARY_ID is missing in environment variables.");
    return "";
  }

  // If no security key is provided, return unsigned URL (only if Token Authentication is disabled in Bunny)
  if (!securityKey) {
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=0`;
  }

  const { token, expires } = generateBunnyToken(videoId, securityKey);
  
  // Standard Signature URL Format
  const url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=0`;
  
  return url;
}
