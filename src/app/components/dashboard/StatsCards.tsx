// components/cashier/dashboard/stats-cards.tsx
import { useBingoStore } from "@/app/stores/bingoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Wallet,
  Coins,
  Trophy,
  Banknote,
} from "lucide-react";

export function StatsCards() {
  const { getWalletBalance, shopCommission, systemCommission, prizePool } =
    useBingoStore();

  const stats = [
    {
      title: "Wallet Balance",
      value: getWalletBalance(),
      icon: Wallet,
      trend: "up",
      change: "+12%",
      description: "Current available balance",
      color: "bg-blue-100 dark:bg-blue-900/50",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Shop Commission",
      value: shopCommission,
      icon: Coins,
      trend: "up",
      change: "+5%",
      description: "From current game",
      color: "bg-purple-100 dark:bg-purple-900/50",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Winning Amount",
      value: prizePool,
      icon: Trophy,
      trend: "down",
      change: "-3%",
      description: "Current game prize pool",
      color: "bg-green-100 dark:bg-green-900/50",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "System Commission",
      value: systemCommission,
      icon: Banknote,
      trend: "up",
      change: "+8%",
      description: "From current game",
      color: "bg-amber-100 dark:bg-amber-900/50",
      textColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className={`${stat.color} border-transparent`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stat.value.toFixed(2)}
              <span
                className={`ml-2 text-xs ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUp className="inline h-3 w-3" />
                ) : (
                  <ArrowDown className="inline h-3 w-3" />
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
