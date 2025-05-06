"use client";

import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Navbar from "../Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export function Topbar() {
  // const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 justify-end items-center gap-4">
        <Navbar />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {status === "loading" ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {/* {status === "authenticated" ? (
                <div className="flex flex-col">
                  <span className="font-medium">session.user?.name</span>
                  <span className="text-xs text-muted-foreground">
                    session.user?.email
                  </span>
                </div>
              ) : (
                "Account"
              )} */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
