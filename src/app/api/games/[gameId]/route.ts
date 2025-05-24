import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT /api/games/[gameId] - Update game numbers
export async function PUT(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { status, endedAt, winnerCard, winnerPlayerId } = await req.json();

    // First get current prize pool
    const game = await db.game.findUnique({
      where: { id: params.gameId },
      select: { prizePool: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Update game
    const updatedGame = await db.game.update({
      where: { id: params.gameId },
      data: {
        status,
        endedAt: new Date(endedAt),
        winnerCard,

        prizePool: game.prizePool,
        // winningAmount: game.prizePool, // Use the pre-fetched prize pool
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update game", details: error },
      { status: 500 }
    );
  }
}
// export async function PUT(
//   req: Request,
//   { params }: { params: { gameId: string } }
// ) {
//   const { calledNumbers, lockedNumbers } = await req.json();

//   try {
//     const game = await db.game.update({
//       where: { id: params.gameId },
//       data: {
//         calledNumbers,
//         lockedNumbers,
//         totalNumbersCalled: calledNumbers.length,
//       },
//     });

//     return NextResponse.json(game);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update game" },
//       { status: 500 }
//     );
//   }
// }

// POST /api/games/[gameId]/end - End the game
export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const { winnerCard, winnerPlayerId } = await req.json();

  try {
    const game = await db.game.update({
      where: { id: params.gameId },
      data: {
        status: "COMPLETED",
        winnerCard,
        // winnerPlayerId,
        prizePool: await db.game
          .findUnique({
            where: { id: params.gameId },
            select: { prizePool: true },
          })
          .then((res) => res?.prizePool || 0),
        endedAt: new Date(),
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: "Failed to end game" }, { status: 500 });
  }
}
