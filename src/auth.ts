import NextAuth from "next-auth";
import { authOptions } from "./lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Export auth utilities
export const auth = () => NextAuth(authOptions).auth;
export const signIn = () => NextAuth(authOptions).signIn;
export const signOut = () => NextAuth(authOptions).signOut;
