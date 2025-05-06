// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { db } from "./db";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || profile.email.split("@")[0],
//           email: profile.email,
//           image: profile.picture,
//           role: "USER", // Default role
//         };
//       },
//       authorization: {
//         params: {
//           prompt: "consent", // Add this to force consent screen
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await db.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) return null;

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         return isValid
//           ? { id: user.id, email: user.email, role: user.role }
//           : null;
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   debug: process.env.NODE_ENV === "development", // Add this option
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role;
//         session.user.id = token.id;
//       }
//       return session;
//     },
//     async signIn({ user, account, profile }) {
//       console.log("SignIn Callback:", { user, account, profile });
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       console.log("Redirect Callback:", { url, baseUrl });
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import bcrypt from "bcryptjs";

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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.email?.split("@")[0] || "User",
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
      }

      // Handle role updates
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      try {
        // Handle Google provider
        if (account?.provider === "google") {
          if (!profile?.email) {
            throw new Error("Google account missing email");
          }

          // Check for existing user
          const existingUser = await db.user.findUnique({
            where: { email: profile.email },
          });

          // Create new user if doesn't exist
          if (!existingUser) {
            await db.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email.split("@")[0],
                image: profile.image,
                role: "USER",
                emailVerified: new Date(),
                accounts: {
                  create: {
                    type: "oauth",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  },
                },
              },
            });
          } else {
            // Link account if user exists but not this provider
            const existingAccount = await db.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              },
            });

            if (!existingAccount) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: "oauth",
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Prevent redirect loops to login
      if (url.startsWith("/login")) return `${baseUrl}/dashboard`;

      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      console.log("Account linked:", {
        userId: user.id,
        provider: account.provider,
      });
    },
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        console.log("New user created via Google:", user.email);
      }
    },
  },
};
