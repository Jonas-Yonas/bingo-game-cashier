"use client";

import Logout from "../components/Logout";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading... DASHBOARD PAGE</div>;
  }

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome back, {session.user.email}</p>

      <Logout />
    </div>
  );
}
