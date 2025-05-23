"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useBingoStore } from "@/app/stores/bingoStore";

export function GamesTable() {
  // In a real app, you would fetch this data from your API
  // For now, we'll use mock data based on the store
  const {
    players,
    gameStarted,
    betAmount,
    prizePool,
    calledNumbers,
    shopCommission,
    systemCommission,
  } = useBingoStore();

  // Mock game data - in reality you'd fetch this from your backend
  const todayGames = [
    {
      id: "GAME-001",
      status: gameStarted ? "active" : "completed",
      betAmount,
      players: players.length,
      timestamp: new Date(),
      winningAmount: prizePool,
      winnerCard: gameStarted ? "-" : "C-123", // Example card number
      totalNumbersCalled: calledNumbers.length,
      shopCommission,
      systemCommission,
    },
    // Add more mock games as needed
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Game ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bet Amount</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Winning Amount</TableHead>
            <TableHead>Winner Card</TableHead>
            <TableHead>Numbers Called</TableHead>
            <TableHead>Shop Commission</TableHead>
            <TableHead>System Commission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todayGames.map((game, index) => (
            <TableRow key={game.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{game.id}</TableCell>
              <TableCell>
                <Badge
                  variant={game.status === "active" ? "default" : "secondary"}
                >
                  {game.status}
                </Badge>
              </TableCell>
              <TableCell>${game.betAmount.toFixed(2)}</TableCell>
              <TableCell>{game.players}</TableCell>
              <TableCell>{(game.timestamp, "PPpp")}</TableCell>
              <TableCell>${game.winningAmount.toFixed(2)}</TableCell>
              <TableCell>{game.winnerCard}</TableCell>
              <TableCell>{game.totalNumbersCalled}</TableCell>
              <TableCell>${game.shopCommission.toFixed(2)}</TableCell>
              <TableCell>${game.systemCommission.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
