"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { RocketIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="container mx-auto py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <RocketIcon className="h-6 w-6 text-emerald-400" />
        <span className="font-bold text-white text-lg">Bingo Blast</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login" className="text-white hover:text-emerald-400">
          Login
        </Link>

        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Get Started
        </Button>
      </div>
    </nav>
  );
}
