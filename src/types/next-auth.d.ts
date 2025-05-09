import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "CASHIER" | "ADMIN"; // use your actual role strings
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "USER" | "CASHIER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "CASHIER" | "ADMIN";
  }
}
