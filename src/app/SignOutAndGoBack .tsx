"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export const SignOutAndGoBack = () => {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <Link href="/" passHref>
      <Button
        size="lg"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 cursor-pointer hover:from-emerald-500 hover:to-teal-500 gap-2 shadow-md hover:shadow-lg transition-all"
        onClick={handleSignOut} // Sign out when clicked
      >
        <ArrowLeftCircle className="w-5 h-5" />
        Go Back Home
      </Button>
    </Link>
  );
};
