"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { columns } from "./GameColumns";
import { DataTable } from "@/components/ui/data-table";

// Mock data - replace with real API call
const games = [
  {
    id: "GAME-001",
    status: "completed",
    betAmount: 30,
    players: 15,
    timestamp: new Date("2023-06-15T10:30:00"),
    winningAmount: 360,
    winnerCard: "C-123",
    totalNumbersCalled: 25,
    shopCommission: 90,
    systemCommission: 18,
  },
  // Add more games...
];

export default function GamesLog() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Game Records</h2>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Game
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
