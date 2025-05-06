"use client";

// // import { signIn } from "next-auth/react";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaCheck,
//   FaHome,
//   FaArrowRight,
// } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
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
// } from "@/components/ui/card";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// const registerSchema = z
//   .object({
//     fullName: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     confirmPassword: z.string(),
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the terms and conditions",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type RegisterFormData = z.infer<typeof registerSchema>;

// export default function RegisterPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       terms: false,
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     setIsLoading(true);
//     setServerError("");

//     try {
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fullName: data.fullName,
//           email: data.email,
//           password: data.password,
//         }),
//       });

//       if (!response.ok) throw new Error(await response.text());

//       // Fix: Redirect to signin with success message
//       const signInUrl = new URL("/auth/signin", window.location.origin);
//       signInUrl.searchParams.set("registered", "true");
//       router.push(signInUrl.toString());
//     } catch (err) {
//       setServerError(
//         err instanceof Error ? err.message : "Registration failed"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//             Create Your Account
//           </CardTitle>
//           <CardDescription className="text-center text-gray-400">
//             Join Bingo Blast today
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="grid gap-4">
//           {serverError && (
//             <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm border border-red-900">
//               {serverError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-2">
//               <label
//                 htmlFor="name"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Full Name
//               </label>
//               <div className="relative">
//                 <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="fullName"
//                   type="text"
//                   placeholder="John Doe"
//                   className={`pl-10 bg-gray-700/50 border-gray-700 text-white ${
//                     errors.fullName ? "border-red-500" : ""
//                   }`}
//                   {...register("fullName")}
//                 />
//               </div>
//               {errors.fullName && (
//                 <p className="text-red-400 text-xs">
//                   {errors.fullName.message}
//                 </p>
//               )}
//             </div>

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
//                   className={`pl-10 bg-gray-700/50 border-gray-700 text-white ${
//                     errors.email ? "border-red-500" : ""
//                   }`}
//                   {...register("email")}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-400 text-xs">{errors.email.message}</p>
//               )}
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
//                   className={`pl-10 bg-gray-700/50 border-gray-700 text-white ${
//                     errors.password ? "border-red-500" : ""
//                   }`}
//                   {...register("password")}
//                 />
//               </div>
//               {errors.password ? (
//                 <p className="text-red-400 text-xs">
//                   {errors.password.message}
//                 </p>
//               ) : (
//                 <p className="text-xs text-gray-400">At least 8 characters</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label
//                 htmlFor="confirmPassword"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <FaCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="••••••••"
//                   className={`pl-10 bg-gray-700/50 border-gray-700 text-white ${
//                     errors.confirmPassword ? "border-red-500" : ""
//                   }`}
//                   {...register("confirmPassword")}
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-red-400 text-xs">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="terms"
//                 className={`border-gray-600 ${
//                   errors.terms ? "border-red-500" : ""
//                 }`}
//                 onCheckedChange={(checked) => {
//                   setValue("terms", checked === true, { shouldValidate: true });
//                 }}
//               />
//               <label
//                 htmlFor="terms"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 I agree to the{" "}
//                 <Link
//                   href="/terms"
//                   className="text-emerald-400 hover:underline"
//                 >
//                   Terms
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="/privacy"
//                   className="text-emerald-400 hover:underline"
//                 >
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>
//             {errors.terms && (
//               <p className="text-red-400 text-xs">{errors.terms.message}</p>
//             )}

//             <Button
//               type="submit"
//               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating account..." : "Create Account"}
//               <FaArrowRight className="ml-2 h-4 w-4" />
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-gray-800/50 px-2 text-gray-400">
//                 Already have an account?
//               </span>
//             </div>
//           </div>

//           <Button
//             variant="outline"
//             className="w-full bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-white"
//             onClick={() => router.push("/auth/signin")}
//           >
//             Sign In
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { AuthForm } from "@/app/components/auth/auth-form";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

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
            Create Your Account
          </h1>
          <p className="text-center text-gray-400">Join Bingo Blast today</p>
        </CardHeader>

        <CardContent>
          <AuthForm isLogin={false} />
        </CardContent>
      </Card>
    </div>
  );
}
