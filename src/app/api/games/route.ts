// import { Game } from "@/types";
// import { NextResponse } from "next/server";

// // Mock database - replace with real DB calls
// let games: Game[] = []; // Your initial game data

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   // Pagination
//   const page = parseInt(searchParams.get("page") || "1");
//   const limit = parseInt(searchParams.get("limit") || "10");

//   // Filtering
//   const shopId = searchParams.get("shopId");
//   const status = searchParams.get("status");
//   const dateFrom = searchParams.get("dateFrom");
//   const dateTo = searchParams.get("dateTo");

//   let filteredGames = [...games];

//   // Apply filters
//   if (shopId) {
//     filteredGames = filteredGames.filter((game) => game.shopId === shopId);
//   }

//   if (status) {
//     filteredGames = filteredGames.filter((game) => game.status === status);
//   }

//   if (dateFrom) {
//     const fromDate = new Date(dateFrom);
//     filteredGames = filteredGames.filter(
//       (game) => new Date(game.timestamp) >= fromDate
//     );
//   }

//   if (dateTo) {
//     const toDate = new Date(dateTo);
//     filteredGames = filteredGames.filter(
//       (game) => new Date(game.timestamp) <= toDate
//     );
//   }

//   // Paginate
//   const startIndex = (page - 1) * limit;
//   const paginatedGames = filteredGames.slice(startIndex, startIndex + limit);

//   return NextResponse.json({
//     data: paginatedGames,
//     total: filteredGames.length,
//     page,
//     totalPages: Math.ceil(filteredGames.length / limit),
//   });
// }

// export async function POST(request: Request) {
//   const gameData = await request.json();
//   const newGame: Game = {
//     id: `GAME-${Date.now()}`,
//     ...gameData,
//     timestamp: new Date(),
//     status: "active",
//     calledNumbers: [],
//   };

//   games.push(newGame);
//   return NextResponse.json(newGame, { status: 201 });
// }

import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Create new game
      const {
        shopId,
        betAmount,
        players,
        prizePool,
        shopCommission,
        systemCommission,
      } = req.body;

      const game = await db.game.create({
        data: {
          shopId,
          betAmount,
          players,
          prizePool,
          shopCommission,
          systemCommission,
          status: "ACTIVE",
          calledNumbers: [],
          lockedNumbers: [],
        },
      });

      return res.status(201).json(game);
    }

    if (req.method === "PUT") {
      // Update existing game (used for both number updates and ending game)
      const { id } = req.query;
      const {
        calledNumbers,
        lockedNumbers,
        status,
        endedAt,
        winnerCard,
        winnerPlayerId,
      } = req.body;

      const updateData: any = {};
      if (calledNumbers) updateData.calledNumbers = calledNumbers;
      if (lockedNumbers) updateData.lockedNumbers = lockedNumbers;
      if (status) updateData.status = status;
      if (endedAt) updateData.endedAt = new Date(endedAt);
      if (winnerCard) updateData.winnerCard = winnerCard;
      if (winnerPlayerId) updateData.winnerPlayerId = winnerPlayerId;

      const updatedGame = await db.game.update({
        where: { id: id as string },
        data: updateData,
      });

      return res.status(200).json(updatedGame);
    }

    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Game API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
