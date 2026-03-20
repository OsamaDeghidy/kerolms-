import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    sessionToken: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      sessionToken: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    sessionToken: string;
  }
}
