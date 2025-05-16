"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useBingoStore } from "@/app/stores/bingoStore";

type GameState = {
  selectedNumbers: number[];
};

export default function BingoGame() {
  const router = useRouter();
  const { players, setPlayers } = useBingoStore();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/(public)/(auth)/login");
    },
  });

  if (session?.user?.role !== "CASHIER") {
    redirect("/unauthorized");
  }

  const [gameState, setGameState] = useState<GameState>({
    selectedNumbers: [],
  });
  const [betAmount, setBetAmount] = useState<number>(30);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [winnerAmount, setWinnerAmount] = useState<number>(0);
  const [walletAmount, setWalletAmount] = useState<number>(5000);

  const clearSelection = () => {
    setGameState({ selectedNumbers: [] });
    setTotalPlayers(0);
    setWinnerAmount(0);
    setPlayers([]);
  };

  const toggleNumberSelection = (number: number) => {
    setGameState((prev) => {
      const isSelected = prev.selectedNumbers.includes(number);
      const newSelected = isSelected
        ? prev.selectedNumbers.filter((n) => n !== number)
        : [...prev.selectedNumbers, number];

      setPlayers(newSelected);
      setTotalPlayers(newSelected.length);
      setWinnerAmount(newSelected.length * betAmount);
      return { selectedNumbers: newSelected };
    });
  };

  const startGame = () => {
    router.push("bingo/caller");
  };

  const numbers = Array.from({ length: 150 }, (_, i) => i + 1);

  console.log(players);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-lg mx-4 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
        <div className="grid grid-cols-4 gap-3 w-full">
          {/* Bet Selector */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs relative group">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
              Bet Amount
            </span>

            {/* Main input with buttons */}
            <div className="flex items-center w-full">
              <button
                onClick={() => setBetAmount((prev) => Math.max(1, prev - 1))}
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
                  const value = Math.max(1, Number(e.target.value));
                  setBetAmount(isNaN(value) ? 1 : value);
                }}
                min="1"
                className="flex-1 bg-white dark:bg-gray-800 text-center font-bold text-gray-800 dark:text-white focus:outline-none px-3 py-2 h-10 text-sm border-y border-gray-300 dark:border-gray-600 w-20"
              />

              <button
                onClick={() => setBetAmount((prev) => prev + 1)}
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

            {/* Quick-select popover - appears on hover */}
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

            {/* Small indicator that quick options exist */}
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Hover for quick options
            </div>
          </div>

          {/* Players */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Players
            </span>
            <span className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
              {totalPlayers}
            </span>
          </div>

          {/* Winner Amount */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Prize Pool
            </span>
            <span className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
              ${winnerAmount.toLocaleString()}
            </span>
          </div>

          {/* Wallet */}
          <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Wallet
            </span>
            <span className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">
              ${walletAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bingo Board - Changed padding from p-4 to p-2 to reduce gap */}
      <div className="flex-1 p-2 w-full max-h-max my-6 overflow-y-auto">
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div
            className="grid min-w-[900px] lg:min-w-0"
            style={{
              gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
              gap: "0.5rem",
            }}
          >
            {numbers.map((number) => (
              <button
                key={number}
                onClick={() => toggleNumberSelection(number)}
                className={`aspect-square w-full flex items-center justify-center rounded-md text-white font-semibold text-base transition-all ${
                  gameState.selectedNumbers.includes(number)
                    ? "bg-red-500 shadow-md"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 p-4 flex justify-center gap-6">
        <button
          onClick={clearSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-colors"
        >
          Clear Selection
        </button>
        <button
          onClick={startGame}
          disabled={gameState.selectedNumbers.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-colors disabled:bg-gray-400 disabled:shadow-none"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
