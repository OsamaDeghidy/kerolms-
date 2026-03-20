import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { randomBytes } from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user || !user.password) return null;

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string, 
          user.password
        );

        if (!isPasswordMatch) return null;

        // Generate a new session token for single-session protection
        const sessionToken = randomBytes(32).toString("hex");
        user.sessionToken = sessionToken;
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          hasAnalysisAccess: user.hasAnalysisAccess,
          sessionToken: sessionToken
        };
      }
    })
  ],
});
