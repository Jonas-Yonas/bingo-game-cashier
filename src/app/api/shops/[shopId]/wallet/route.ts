// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: { shopId: string } }
// ) {
//   try {
//     const shop = await db.shop.findUnique({
//       where: { id: params.shopId },
//       select: { walletBalance: true },
//     });

//     const transactions = await db.walletTransaction.findMany({
//       where: { shopId: params.shopId },
//       orderBy: { createdAt: "desc" },
//       take: 50,
//     });

//     return NextResponse.json({
//       balance: shop?.walletBalance || 0,
//       transactions: transactions.map((t) => ({
//         amount: t.amount,
//         type: t.type,
//         timestamp: t.createdAt,
//         note: t.reference,
//       })),
//     });
//   } catch (error) {
//     console.error("[GET_WALLET]", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/shops/[shopId]/wallet/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const shop = await db.shop.findUnique({
      where: { id: params.shopId },
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
