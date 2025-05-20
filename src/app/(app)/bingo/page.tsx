"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useBingoStore } from "@/app/stores/bingoStore";
import { Spinner } from "@/components/ui/spinner";

type GameState = {
  selectedNumbers: number[];
};

export default function BingoGame() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/(public)/(auth)/login");
    },
  });

  // Get all store methods and state
  const {
    players,
    setPlayers,
    betAmount,
    setBetAmount,
    prizePool,
    getWalletBalance,
    canStartGame,
    addPlayer,
    removePlayer,
    walletTransactions, // Add this if you want to display transaction history
  } = useBingoStore();

  // Calculate current wallet amount
  const walletAmount = getWalletBalance();

  // Numbers for the board
  const numbers = Array.from({ length: 200 }, (_, i) => i + 1);

  useEffect(() => {
    if (session && session.user.role !== "CASHIER") {
      router.push("/unauthorized");
    }
  }, [session]);

  const [gameState, setGameState] = useState<GameState>({
    selectedNumbers: [],
  });
  const [isStarting, setIsStarting] = useState(false);

  // Clear all selections
  const clearSelection = () => {
    setGameState({ selectedNumbers: [] });
    setPlayers([]);
  };

  // Toggle number selection and manage players
  const toggleNumberSelection = (number: number) => {
    setGameState((prev) => {
      const isSelected = prev.selectedNumbers.includes(number);
      const newSelected = isSelected
        ? prev.selectedNumbers.filter((n) => n !== number)
        : [...prev.selectedNumbers, number];

      // Update players in store - only need to call one method
      if (isSelected) {
        removePlayer(number);
      } else {
        addPlayer(number); // This now handles duplicates
      }

      return { selectedNumbers: isSelected ? newSelected : newSelected };
    });
  };

  // Start game handler
  const startGame = async () => {
    if (!canStartGame()) return;

    setIsStarting(true);

    try {
      useBingoStore.getState().startGame(); // performs calculation + deduction
      await router.push("bingo/caller"); // or next step in game
    } catch (error) {
      console.error("Failed to start game:", error);
      setIsStarting(false); // Re-enable if navigation fails
    }
  };

  useEffect(() => {
    setGameState({ selectedNumbers: players });
  }, [players]);

  if (status === "loading") {
    return (
      <div className="p-4">
        <Spinner />
        <span>Loading game...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="shadow-sm rounded-lg mx-4 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
        <div className="grid grid-cols-4 gap-3 w-full">
          {/* Bet Selector (Fixed) */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs relative group">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
              Bet Amount
            </span>
            <div className="flex items-center w-full">
              <button
                onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-l-lg px-3 py-2 h-10 flex items-center justify-center border border-r-0 border-gray-300 dark:border-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(1000, Number(e.target.value) || 1)
                  );
                  setBetAmount(value);
                }}
                min="1"
                max="1000"
                className="flex-1 bg-white dark:bg-gray-800 text-center font-bold text-gray-800 dark:text-white focus:outline-none px-3 py-2 h-10 text-2xl border-y border-gray-300 dark:border-gray-600 w-20"
              />
              <button
                onClick={() => setBetAmount(betAmount + 1)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-r-lg px-3 py-2 h-10 flex items-center justify-center border border-l-0 border-gray-300 dark:border-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            {/* Quick-select options */}
            <div className="absolute top-full mt-2 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex flex-wrap justify-center gap-2">
                  {[10, 20, 30, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        betAmount === amount
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Hover for quick options
            </div>
          </div>

          {/* Players */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Players
            </span>
            <span className="mt-1 text-4xl font-bold text-blue-600 dark:text-blue-400">
              {players.length}
            </span>
          </div>

          {/* Prize Pool */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Prize Pool
            </span>
            <span className="flex items-center mt-1 text-4xl font-bold text-green-600 dark:text-green-400">
              <span className="text-xl font-medium text-gray-300">$</span>
              {prizePool.toLocaleString()}
            </span>
          </div>

          {/* Wallet */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Wallet
            </span>
            <span
              className={`flex items-center mt-1 text-4xl font-bold ${
                walletAmount >= 0
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              <span className="text-xl font-medium text-gray-300">$</span>
              {walletAmount.toLocaleString()}
            </span>
            <span className="text-xs text-blue-500 mt-1">Base: $ 5000</span>
          </div>
        </div>
      </div>

      {/* Bingo Board */}
      <div className="flex-1 px-2 w-full max-h-fit mt-4 overflow-y-auto">
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div
            className="grid min-w-[900px] lg:min-w-0"
            style={{
              gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
              gap: "0.3rem",
            }}
          >
            {numbers.map((number) => (
              <button
                key={number}
                onClick={() => toggleNumberSelection(number)}
                className={`aspect-square w-full flex items-center justify-center rounded text-white font-semibold text-lg transition-all ${
                  gameState.selectedNumbers.includes(number)
                    ? "bg-red-500 shadow-md"
                    : "bg-blue-600 hover:bg-blue-900"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 flex flex-col items-center gap-3">
        <div className="flex gap-6">
          <button
            onClick={clearSelection}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-colors"
          >
            Clear Selection
          </button>
          <button
            onClick={startGame}
            disabled={!canStartGame()}
            className={`px-10 py-3 rounded-lg text-sm font-medium shadow-md transition-colors ${
              canStartGame()
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isStarting ? "Starting..." : "Start Game"}
          </button>
        </div>

        {/* Enhanced Wallet Messages */}
        {/* {walletAmount <= 0 && (
          <div className="text-red-500 text-sm">
            Wallet balance is empty! Please top up to start a new game.
          </div>
        )}
        {players.length > 0 && walletAmount > 0 && (
          <div className="text-green-500 text-sm">
            Ready to start game with {players.length} players
          </div>
        )} */}
      </div>
    </div>
  );
}
