"use client";

import { useGames } from "@/hooks/useGames";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { format, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GameCharts() {
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const { data, isLoading } = useGames({
    dateFrom,
    limit: 1000, // Get enough data for charts
  });

  if (isLoading) {
    return (
      <div className="grid h-[400px] gap-4 md:grid-cols-2">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!data?.data) return null;

  // Process data for charts
  const dailyData = data.data.reduce((acc, game) => {
    const date = format(new Date(game.timestamp), "MMM dd");
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      existing.games += 1;
      existing.players += game.players.length;
      existing.commission += game.shopCommission + game.systemCommission;
    } else {
      acc.push({
        date,
        games: 1,
        players: game.players.length,
        commission: game.shopCommission + game.systemCommission,
      });
    }

    return acc;
  }, [] as { date: string; games: number; players: number; commission: number }[]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Games per Day</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="games" fill="#8884d8" name="Games" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Players & Commission</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="players"
                stroke="#8884d8"
                name="Players"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="commission"
                stroke="#82ca9d"
                name="Commission ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
