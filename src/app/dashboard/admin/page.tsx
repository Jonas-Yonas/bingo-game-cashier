// import { redirect } from "next/navigation";

import Dashboard from "@/app/components/Dashboard";

// import { auth } from "@/auth";

export default async function DashboardPage() {
  //   const session = await auth();

  //   console.log(session);
  //   if (!session) {
  //     redirect("/auth/signin?callbackUrl=/admin/dashboard");
  //   }

  // Fix: Add debug and proper role check
  //   console.log("Session role:", session.user?.role);
  //   if (session.user?.role !== "admin") {
  //     redirect("/unauthorized");
  //   }

  // if (!session) {
  //   redirect("/auth/signin?callbackUrl=/dashboard");
  // }

  return <Dashboard />;
}
