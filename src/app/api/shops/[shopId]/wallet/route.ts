import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { shopId: string } }
) {
  const shopId = context.params.shopId;

  try {
    const shop = await db.shop.findUnique({
      where: { id: shopId },
      select: { walletBalance: true },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({
      balance: shop.walletBalance,
    });
  } catch (error) {
    console.error("[GET_WALLET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
