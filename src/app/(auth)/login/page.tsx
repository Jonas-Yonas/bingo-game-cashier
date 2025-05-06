"use client";

// import { signIn, useSession } from "next-auth/react";
// import {
//   FaGoogle,
//   FaGithub,
//   FaEnvelope,
//   FaLock,
//   FaHome,
//   FaArrowRight,
// } from "react-icons/fa";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";

// export default function LoginPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useSearchParams();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const callbackUrl = params.get("callbackUrl") || "/dashboard";

//   // Add session effect to prevent loops
//   useEffect(() => {
//     if (status === "authenticated" && session) {
//       console.log("Already authenticated, redirecting to", callbackUrl);
//       router.push(callbackUrl);
//     }
//   }, [status, session, callbackUrl, router]);

//   const handleCredentialsLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       console.log("Attempting login with:", { email, callbackUrl });

//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//         callbackUrl,
//       });

//       console.log("SignIn result:", result);

//       if (result?.error) {
//         throw new Error(result.error);
//       }

//       // IMPORTANT FIX: Verify the URL before redirecting
//       const redirectUrl = result?.url || callbackUrl;
//       console.log("Preparing to redirect to:", redirectUrl);

//       if (redirectUrl) {
//         // Use replace instead of push to prevent back navigation to login
//         router.replace(redirectUrl);
//       } else {
//         throw new Error("No redirect URL provided");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err instanceof Error ? err.message : "Login failed");
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider: string) => {
//     try {
//       setError("");
//       const result = await signIn(provider, {
//         callbackUrl,
//         redirect: false,
//       });

//       if (result?.error) {
//         throw new Error(result.error);
//       }

//       if (result?.url) {
//         router.push(result.url);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : `${provider} login failed`);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
//         <div className="text-white">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md border-0 bg-gray-800/50 backdrop-blur-sm">
//         <CardHeader className="space-y-1 relative">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute left-4 top-4 text-gray-400 hover:text-white"
//             onClick={() => router.push("/")}
//           >
//             <FaHome className="h-5 w-5" />
//           </Button>
//           <CardTitle className="text-2xl text-center text-white">
//             Welcome to Bingo Blast
//           </CardTitle>
//           <CardDescription className="text-center text-gray-400">
//             Sign in to your account
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="grid gap-4">
//           {error && (
//             <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm border border-red-900">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleCredentialsLogin} className="space-y-4">
//             <div className="space-y-2">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Email
//               </label>
//               <div className="relative">
//                 <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your@email.com"
//                   className="pl-10 bg-gray-700/50 border-gray-700 text-white"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   className="pl-10 bg-gray-700/50 border-gray-700 text-white"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Checkbox id="remember" className="border-gray-600" />
//                 <label
//                   htmlFor="remember"
//                   className="text-sm font-medium text-gray-300"
//                 >
//                   Remember me
//                 </label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm text-emerald-400 hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Sign In"}
//               <FaArrowRight className="ml-2 h-4 w-4" />
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-gray-800/50 px-2 text-gray-400">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <Button
//               variant="outline"
//               className="bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-white"
//               onClick={() => handleSocialLogin("google")}
//               disabled={isLoading}
//             >
//               <FaGoogle className="mr-2 h-4 w-4 text-red-400" />
//               Google
//             </Button>
//             <Button
//               variant="outline"
//               className="bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-white"
//               onClick={() => handleSocialLogin("github")}
//               disabled={isLoading}
//             >
//               <FaGithub className="mr-2 h-4 w-4" />
//               GitHub
//             </Button>
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-center">
//           <p className="text-sm text-gray-400">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/auth/signup"
//               className="text-emerald-400 hover:underline"
//             >
//               Sign up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { AuthForm } from "@/app/components/auth/auth-form";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  console.log(status, session);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-gray-400 hover:text-white"
            onClick={() => router.push("/")}
          >
            <FaHome className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center text-white">
            Welcome to Bingo Blast
          </h1>
          <p className="text-center text-gray-400">Sign in to your account</p>
        </CardHeader>

        <CardContent>
          <AuthForm isLogin />
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-emerald-400 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-emerald-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
