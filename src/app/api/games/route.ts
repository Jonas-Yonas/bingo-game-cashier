import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST /api/games - Create a new game
export async function POST(req: Request) {
  try {
    const { shopId, betAmount, players } = await req.json();

    // Validate shopId format (24-character hex)
    if (!/^[0-9a-fA-F]{24}$/.test(shopId)) {
      return NextResponse.json(
        { error: "Invalid shopId format" },
        { status: 400 }
      );
    }

    // Calculate game values
    const totalBet = players.length * betAmount;
    const shopCommission = totalBet * 0.2;
    const systemCommission = shopCommission * 0.2;
    const prizePool = totalBet - shopCommission;

    // Convert player IDs to strings
    const stringPlayers = players.map(String);

    // Create game - Prisma will handle ObjectId conversion
    const game = await db.game.create({
      data: {
        shopId, // Pass as plain string
        betAmount,
        players: stringPlayers, // Ensure string array
        prizePool,
        shopCommission,
        systemCommission,
        status: "ACTIVE",
        calledNumbers: [],
        lockedNumbers: [],
        totalNumbersCalled: 0,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Full creation error:", {
      message: error,
      code: error,
      meta: error,
      stack: error,
    });

    return NextResponse.json(
      {
        error: "Game creation failed",
        details: {
          code: error,
          meta: error,
        },
      },
      { status: 500 }
    );
  }
}

// GET /api/games - Fetch game history for a shop
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");

  if (!shopId) {
    return NextResponse.json({ error: "shopId is required" }, { status: 400 });
  }

  try {
    const games = await db.game.findMany({
      where: { shopId },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
