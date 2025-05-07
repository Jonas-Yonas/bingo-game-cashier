"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LayoutDashboard, LogOutIcon, RocketIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="container mx-auto py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <RocketIcon className="h-6 w-6 text-emerald-400" />
        <span className="font-bold text-white text-lg">Bingo Blast</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/dashboard"
          className="text-white hover:text-emerald-400 flex items-center gap-1"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Button
          variant="ghost"
          className="text-white hover:text-red-400 flex items-center gap-1 cursor-pointer"
          // onClick={() => signOut()}
          onClick={() =>
            signOut({
              callbackUrl: "/login",
              redirect: true,
            })
          }
        >
          <LogOutIcon className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </nav>
  );
}
