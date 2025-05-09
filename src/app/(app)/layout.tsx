"use client";

import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

const CashierLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center py-6">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm mt-4">
            Loading your experience ...
          </p>
        </div>
      </div>
    );

  if (!session || session.user.role !== "CASHIER") {
    return redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: isCollapsed ? "4rem" : "16rem" }}
      >
        <Topbar />
        <main className="flex-1 p-4 md:p-5">{children}</main>
      </div>
    </div>
  );
};

export default CashierLayout;
