import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch from your database
  const cashier = await db.cashier.findUnique({
    where: { email: session.user.email },
    select: { shopId: true },
  });

  if (!cashier) {
    return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
  }

  return NextResponse.json({ shopId: cashier.shopId });
}
