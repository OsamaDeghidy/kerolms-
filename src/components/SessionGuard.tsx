"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function SessionGuard() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Only check if user is logged in
    if (status === "authenticated" && session?.user) {
      const verifySession = async () => {
        try {
          const res = await fetch("/api/auth/verify-session");
          if (res.status === 403) {
            // Token mismatch -> other login detected
            await signOut({ callbackUrl: "/auth/login?error=multiple_sessions" });
          }
        } catch (err) {
          console.error("Session verification failed", err);
        }
      };

      // Check on initial load and when pathname changes
      verifySession();

      // Optional: Poll every 30 seconds for extra security
      const interval = setInterval(verifySession, 30000);
      return () => clearInterval(interval);
    }
  }, [session, status, pathname]);

  return null;
}
