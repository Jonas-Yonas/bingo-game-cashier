"use client";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const error = useSearchParams().get("error");

  const errorMessages: Record<string, string> = {
    Callback: "Authentication failed. Please try another method.",
    OAuthAccountNotLinked:
      "This email is already in use with another provider.",
    Default: "An authentication error occurred.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p>{errorMessages[error || "Default"]}</p>
        <a
          href="/auth/login"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Return to login
        </a>
      </div>
    </div>
  );
}
