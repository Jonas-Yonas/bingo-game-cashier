"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useBingoStore } from "@/app/stores/bingoStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Table } from "lucide-react";

export function RecentTransactions() {
  const { walletTransactions } = useBingoStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletTransactions.slice(0, 5).map((txn, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Badge
                    variant={txn.type === "topup" ? "default" : "secondary"}
                  >
                    {txn.type}
                  </Badge>
                </TableCell>
                <TableCell
                  className={txn.amount > 0 ? "text-green-500" : "text-red-500"}
                >
                  {txn.amount > 0 ? "+" : ""}
                  {txn.amount.toFixed(2)}
                </TableCell>
                <TableCell>{format(txn.timestamp, "PPpp")}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {txn.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
