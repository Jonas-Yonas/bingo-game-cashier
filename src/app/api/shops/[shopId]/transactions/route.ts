import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const { amount, type, note } = await request.json();

    // Input validation
    if (typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await db.walletTransaction.create({
      data: {
        amount,
        type,
        reference: note || "Bingo game commission",
        shopId: params.shopId,
      },
    });

    // Update shop balance (use decrement for negative amounts)
    const updateOperation = amount >= 0 ? "increment" : "decrement";
    const shop = await db.shop.update({
      where: { id: params.shopId },
      data: {
        walletBalance: {
          [updateOperation]: Math.abs(amount),
        },
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: shop.walletBalance,
    });
  } catch (error) {
    console.error("[CREATE_TRANSACTION]", error);
    return NextResponse.json(
      {
        error: "Transaction failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// app/api/shops/[shopId]/transactions/route.ts
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(
//   request: Request,
//   { params }: { params: { shopId: string } }
// ) {
//   try {
//     const { amount, type, note } = await request.json();

//     // Validate transaction type
//     const validTypes = ["COMMISSION", "TOPUP", "ADJUSTMENT", "WINNING"];
//     if (!validTypes.includes(type)) {
//       return NextResponse.json(
//         { error: "Invalid transaction type" },
//         { status: 400 }
//       );
//     }

//     const transaction = await db.walletTransaction.create({
//       data: {
//         amount,
//         type: type as "COMMISSION" | "TOPUP" | "ADJUSTMENT" | "WINNING",
//         reference: note || "System commission",
//         shopId: params.shopId,
//       },
//     });

//     return NextResponse.json(transaction);
//   } catch (error) {
//     console.error("Transaction error:", error);
//     return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
//   }
// }
