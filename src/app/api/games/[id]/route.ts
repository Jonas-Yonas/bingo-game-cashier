import { Game } from "@/types";
import { NextResponse } from "next/server";

let games: Game[] = []; // Your initial game data

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const game = games.find((g) => g.id === params.id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const gameIndex = games.findIndex((g) => g.id === params.id);

  if (gameIndex === -1) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const updates = await request.json();
  games[gameIndex] = { ...games[gameIndex], ...updates };

  return NextResponse.json(games[gameIndex]);
}
