"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";
import { capitalizeFirstLetter } from "../lib/utils";

// Mock data for dashboard - will be replaced with real data later
const recentGames = [
  {
    id: 1,
    gameType: "Blackjack",
    player: "john_doe",
    betAmount: 50,
    payout: 100,
    outcome: "Win",
    timestamp: "2023-06-15 14:30:22",
  },
  {
    id: 2,
    gameType: "Roulette",
    player: "sarah_smith",
    betAmount: 25,
    payout: 0,
    outcome: "Loss",
    timestamp: "2023-06-15 14:25:10",
  },
  {
    id: 3,
    gameType: "Slots",
    player: "mike_jones",
    betAmount: 10,
    payout: 250,
    outcome: "Win",
    timestamp: "2023-06-15 14:15:45",
  },
  {
    id: 4,
    gameType: "Poker",
    player: "emily_wilson",
    betAmount: 100,
    payout: 200,
    outcome: "Win",
    timestamp: "2023-06-15 13:50:33",
  },
  {
    id: 5,
    gameType: "Blackjack",
    player: "david_kim",
    betAmount: 75,
    payout: 0,
    outcome: "Loss",
    timestamp: "2023-06-15 13:45:12",
  },
];

const stats = [
  {
    name: "Total Players",
    value: "1,248",
    change: "+12%",
    changeType: "positive",
  },
  { name: "Active Games", value: "24", change: "+3", changeType: "positive" },
  {
    name: "Total Wagers",
    value: "$56,789",
    change: "-2%",
    changeType: "negative",
  },
  { name: "Payouts", value: "$48,123", change: "+8%", changeType: "positive" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Loading dashboard...</p>

          <Spinner size="lg" />

          {/* <Button disabled>
            <Spinner size="sm" className="mr-2" />
              Submitting...
            </Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {capitalizeFirstLetter(session?.user.role!)} Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor game activity and player statistics
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors text-sm sm:text-base">
              Refresh Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            {["overview", "games", "players", "transactions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm sm:text-base ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                <span
                  className={`inline-flex items-baseline px-2 py-0.5 rounded-full text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Games Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium leading-6 text-gray-800 dark:text-white">
                Recent Games
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Game
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Player
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Bet
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Payout
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Outcome
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentGames.map((game) => (
                    <tr
                      key={game.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        {game.gameType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {game.player}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${game.betAmount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            game.payout > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {game.payout > 0 ? `$${game.payout}` : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            game.outcome === "Win"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {game.outcome}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(game.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Previous
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page 1 of 5
              </span>
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Next
              </button>
            </div>
          </div>

          {/* Quick Stats and Activity */}
          <div className="space-y-6">
            {/* Game Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Game Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Blackjack", value: 45, color: "bg-blue-500" },
                  { name: "Roulette", value: 25, color: "bg-green-500" },
                  { name: "Slots", value: 15, color: "bg-yellow-500" },
                  { name: "Poker", value: 10, color: "bg-purple-500" },
                  { name: "Other", value: 5, color: "bg-gray-500" },
                ].map((game) => (
                  <div key={game.name} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {game.name}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {game.value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${game.color} h-2 rounded-full`}
                        style={{ width: `${game.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                System Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: "login",
                    user: "admin",
                    time: "2 minutes ago",
                    success: true,
                  },
                  {
                    id: 2,
                    type: "payout",
                    user: "system",
                    time: "15 minutes ago",
                    success: true,
                  },
                  {
                    id: 3,
                    type: "maintenance",
                    user: "system",
                    time: "1 hour ago",
                    success: false,
                  },
                  {
                    id: 4,
                    type: "backup",
                    user: "system",
                    time: "2 hours ago",
                    success: true,
                  },
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div
                      className={`p-1 rounded-full mr-3 ${
                        activity.success
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {activity.success ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
