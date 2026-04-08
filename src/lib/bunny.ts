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
 * 
 * NOTE: Watermarking disabled for troubleshooting 403 errors.
 */
export function generateBunnyToken(
  videoId: string,
  securityKey: string,
  expirationTime: number = 3600
): { token: string; expires: number } {
  const expires = Math.floor(Date.now() / 1000) + expirationTime;
  
  // Base Standard Format: sha256(securityKey + videoId + expires)
  const hashContent = `${securityKey}${videoId}${expires}`;
  
  // LOGGING FOR DEBUGGING
  const maskedKey = securityKey.substring(0, 4) + "****" + securityKey.substring(securityKey.length - 4);
  console.log(`[BUNNY_DEBUG_SIGN] String being hashed: ${maskedKey}${videoId}${expires}`);
  
  const token = crypto.createHash("sha256").update(hashContent).digest("hex");
  
  return { token, expires };
}

/**
 * Generates the full iframe URL with security.
 */
export function getSecureVideoUrl(videoId: string, studentName: string = "") {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID || process.env.BUNNY_STREAM_LIBRARY_ID || "618907";
  const securityKey = process.env.BUNNY_SECURITY_KEY;

  if (!securityKey) {
    console.warn("⚠️ [BUNNY_DEBUG] Security Key missing in .env.");
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=0`;
  }

  const { token, expires } = generateBunnyToken(videoId, securityKey);
  
  // Standard Signature URL
  let url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=0`;
  
  // For now, we omit the &watermark parameter to see if the video plays at all
  console.log(`[BUNNY_DEBUG_URL] ${url.substring(0, 60)}...`);
  return url;
}
