"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <Button onClick={() => signOut()}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </Button>
  );
};

export default Logout;
