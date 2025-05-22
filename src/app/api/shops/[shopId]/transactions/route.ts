import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { shopId: string } }
) {
  try {
    const { params } = context;
    const { amount, type, note } = await request.json();

    // Create transaction
    const transaction = await db.walletTransaction.create({
      data: {
        amount,
        type,
        reference: note || "Bingo game commission",
        shopId: params.shopId,
      },
    });

    // Update shop balance
    const shop = await db.shop.update({
      where: { id: params.shopId },
      data: {
        walletBalance: {
          increment: amount, // Use decrement if amount is negative
        },
      },
    });

    return NextResponse.json({
      transaction,
      newBalance: shop.walletBalance,
    });
  } catch (error) {
    console.error("[CREATE_TRANSACTION]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
