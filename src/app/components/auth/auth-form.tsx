"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  FaGoogle,
  FaGithub,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaUser,
} from "react-icons/fa";
import { showToast } from "@/lib/toast";

type FormData = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  remember?: boolean;
  terms?: boolean;
};

export function AuthForm({ isLogin = true }: { isLogin?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) throw new Error(result.error);
        router.push("/dashboard");
      } else {
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });

        if (!response.ok) throw new Error("Registration failed");

        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Authentication failed",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="John Doe"
              className="pl-10 bg-gray-700/50 border-gray-700 text-white"
              {...register("name", { required: !isLogin })}
            />
            {errors.name && (
              <p className="text-red-400 text-xs">Name is required</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="youremail@email.com"
            className="pl-10 bg-gray-700/50 border-gray-700 text-white"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-400 text-xs">Valid email is required</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {isLogin ? "Password" : "Password (min 8 characters)"}
        </label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-gray-700/50 border-gray-700 text-white"
            {...register("password", {
              required: true,
              minLength: isLogin ? undefined : 8,
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-xs">
              {isLogin ? "Password required" : "Minimum 8 characters"}
            </p>
          )}
        </div>
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <FaCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-gray-700/50 border-gray-700 text-white"
              {...register("confirmPassword", { required: !isLogin })}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs">Passwords must match</p>
            )}
          </div>
        </div>
      )}

      {isLogin ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border-gray-600"
              {...register("remember")}
            />
            <label htmlFor="remember" className="text-sm text-gray-300">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-emerald-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            className="border-gray-600"
            {...register("terms", { required: true })}
          />
          <label htmlFor="terms" className="text-sm text-gray-300">
            I agree to the{" "}
            <Link href="/terms" className="text-emerald-400 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-400 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        disabled={isLoading}
      >
        {isLoading
          ? isLogin
            ? "Signing in..."
            : "Creating account..."
          : isLogin
          ? "Sign In"
          : "Create Account"}
      </Button>

      {isLogin && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800/50 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-white"
              onClick={() => handleSocialLogin("google")}
              // onClick={() => handleSocialLogin("google", { callbackUrl: "/dashboard" })}
              type="button"
              // disabled={isLoading}
              disabled
            >
              <FaGoogle className="mr-2 h-4 w-4 text-red-400" />
              Google
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-white"
              onClick={() => handleSocialLogin("github")}
              type="button"
              // disabled={isLoading}
              disabled
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </>
      )}

      <div className="text-center text-sm text-gray-400">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-400 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
