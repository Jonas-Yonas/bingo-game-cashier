import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Game = {
  id: string;
  status: "active" | "completed";
  betAmount: number;
  players: number;
  timestamp: Date;
  winningAmount: number;
  winnerCard: string;
  totalNumbersCalled: number;
  shopCommission: number;
  systemCommission: number;
};

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "id",
    header: "Game ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          status
        </Badge>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "players",
    header: "Players",
  },
  {
    accessorKey: "betAmount",
    header: "Bet Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("betAmount"));
      return <div className="font-medium">${amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "winningAmount",
    header: "Prize",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("winningAmount"));
      return (
        <div className="font-medium text-green-600">${amount.toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: "winnerCard",
    header: "Winner",
  },
  {
    accessorKey: "totalNumbersCalled",
    header: "Numbers Called",
  },
  {
    accessorKey: "shopCommission",
    header: "Shop Commission",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("shopCommission"));
      return <div className="font-medium">${amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "systemCommission",
    header: "System Commission",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("systemCommission"));
      return <div className="font-medium">${amount.toFixed(2)}</div>;
    },
  },
];
