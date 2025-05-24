import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/games/[gameId]/end/route.ts
export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const { winnerCard, lastCalledNumber, calledNumbers, totalNumbersCalled } =
    await req.json();

  // Validate winnerLastCalledNumber is a number
  if (lastCalledNumber && typeof lastCalledNumber !== "number") {
    return NextResponse.json(
      { error: "winnerPlayerId must be a number" },
      { status: 400 }
    );
  }

  // Todo: to be implemented later on
  //   if (!Array.isArray(calledNumbers)) {
  //     return NextResponse.json(
  //       { error: "calledNumbers must be an array" },
  //       { status: 400 }
  //     );
  //   }

  try {
    const game = await db.game.update({
      where: { id: params.gameId },
      data: {
        status: "COMPLETED",
        calledNumbers: {
          set: calledNumbers.filter((n: number) => typeof n === "number"), // Ensure numbers && Save entire array at end
        },
        // lastCalledNumber, // Optional tracking
        lastCalledNumber:
          typeof lastCalledNumber === "number" ? lastCalledNumber : null, // Optional tracking
        winnerCard: winnerCard || null,
        totalNumbersCalled: totalNumbersCalled,
        // winnerPlayerId: winnerPlayerId ? String(winnerPlayerId) : null, // Ensure string
        endedAt: new Date(),
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Completion error:", {
      message: error,
      code: error,
      meta: error,
    });
    return NextResponse.json(
      {
        error: "Failed to complete game",
        details: {
          prismaError: error,
          message: error,
        },
      },
      { status: 500 }
    );
  }
}
