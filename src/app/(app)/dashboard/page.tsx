"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { ROLES } from "@/types";
import Dashboard from "@/app/components/dashboard/Dashboard";
import { loadAllAudiosSimple } from "@/lib/dexieDatabase";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">
          Loading your experience...
        </p>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
    return null;
  }

  if (session.user.role !== ROLES.CASHIER) {
    redirect("/unauthorized");
    return null;
  }

  if (session?.user.role === ROLES.CASHIER) {
    // Start loading audios in the background
    loadAllAudiosSimple()
      .then((success) => {
        if (success) console.log("All audio files loaded!");
      })
      .catch((err) => console.error("Audio loading error:", err));
  }

  return <Dashboard />;
}
