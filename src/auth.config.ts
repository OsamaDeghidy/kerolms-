import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedPage = 
        nextUrl.pathname.includes('/dashboard') || 
        nextUrl.pathname.includes('/checkout') || 
        nextUrl.pathname.includes('/admin') ||
        nextUrl.pathname.includes('/learn');

      if (isProtectedPage) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // @ts-ignore
        token.hasAnalysisAccess = user.hasAnalysisAccess;
        // @ts-ignore
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.hasAnalysisAccess = token.hasAnalysisAccess;
        // @ts-ignore
        session.user.sessionToken = token.sessionToken;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [], // Add empty providers to be populated in auth.ts
} satisfies NextAuthConfig;
