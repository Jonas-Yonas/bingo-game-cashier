import { NextAuthOptions, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import bcrypt from "bcryptjs";

interface GoogleProfile extends Profile {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      profile(profile: GoogleProfile): User {
        if (!profile.sub || !profile.email) {
          throw new Error("Google profile missing required fields");
        }

        return {
          id: profile.sub,
          name: profile.name || profile.email.split("@")[0],
          email: profile.email,
          image: profile.picture,
          role: "USER",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }

      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "google") {
          const googleProfile = profile as GoogleProfile;

          if (!googleProfile?.email || !googleProfile.sub) {
            throw new Error("Google profile missing required fields");
          }

          const existingUser = await db.user.findUnique({
            where: { email: googleProfile.email },
            include: { accounts: true },
          });

          if (!existingUser) {
            await db.user.create({
              data: {
                email: googleProfile.email,
                name: googleProfile.name || googleProfile.email.split("@")[0],
                image: googleProfile.picture,
                role: "USER",
                emailVerified: new Date(),
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                  },
                },
              },
            });
          } else {
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: googleProfile.name || existingUser.name,
                image: googleProfile.picture || existingUser.image,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            });

            const accountExists = existingUser.accounts.some(
              (acc) =>
                acc.provider === account.provider &&
                acc.providerAccountId === account.providerAccountId
            );

            if (!accountExists) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                },
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error("Authentication error:", {
          error,
          account,
          profile,
        });
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/login")) return `${baseUrl}/dashboard`;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        console.log("New Google user created:", user.email);
      }
    },
  },
};
