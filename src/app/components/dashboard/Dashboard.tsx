import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { QuickActions } from "./QuickActions";
import { RecentTransactions } from "./RecentTransactions";
import { StatsCards } from "./StatsCards";
import { GameCharts } from "./GameCharts";

export default function CashierDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cashier Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            {/* Add any action buttons here */}
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Game Status Card - Optional */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <CardHeader>
              <CardTitle>Current Game Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players:</span>
                  <span>15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Numbers Called:</span>
                  <span>24/75</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-900/30 dark:to-amber-900/30">
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Today's Summary
                </Button>
                <Button variant="outline" className="w-full">
                  Player Activity
                </Button>
                <Button variant="outline" className="w-full">
                  Commission Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <GameCharts /> */}
        </div>
      </div>
    </div>
  );
}
