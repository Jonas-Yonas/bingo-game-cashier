"use client";

import { WalletDisplay } from "../wallet/WalletDisplay";
import { useEffect } from "react";
import { useBingoStore } from "@/app/stores/bingoStore";
import { useResolvedShopId } from "@/hooks/useResolvedShopId";

interface BingoHeaderProps {
  betAmount: number;
  players: number[];
  prizePool: number;
  walletAmount: number;
  onBetAmountChange: (amount: number) => void;
}

export function BingoHeader({
  betAmount,
  players,
  prizePool,
  walletAmount,
  onBetAmountChange,
}: BingoHeaderProps) {
  const walletBalance = useBingoStore((state) => state.getWalletBalance());
  const syncWallet = useBingoStore((state) => state.syncWallet);
  const shopId = useResolvedShopId();

  useEffect(() => {
    if (shopId) {
      syncWallet(shopId);
    }
  }, [shopId, syncWallet]);

  return (
    <div className="shadow-sm rounded-lg mx-4 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <div className="grid grid-cols-4 gap-3 w-full">
        {/* Bet Selector */}
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs relative group">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
            Bet Amount
          </span>
          <div className="flex items-center w-full">
            <button
              onClick={() => onBetAmountChange(Math.max(1, betAmount - 1))}
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
                onBetAmountChange(value);
              }}
              min="1"
              max="1000"
              className="flex-1 bg-white dark:bg-gray-800 text-center font-bold text-gray-800 dark:text-white focus:outline-none px-3 py-2 h-10 text-2xl border-y border-gray-300 dark:border-gray-600 w-20"
            />
            <button
              onClick={() => onBetAmountChange(betAmount + 1)}
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
                    onClick={() => onBetAmountChange(amount)}
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
          <span className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {players.length}
          </span>
        </div>

        {/* Prize Pool */}
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Prize Pool
          </span>
          <span className="flex items-center mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
            <span className="text-xl font-medium text-gray-300">$</span>
            {prizePool.toLocaleString()}
          </span>
        </div>

        {/* Wallet */}
        {/* <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Wallet
          </span>
          <span
            className={`flex items-center mt-1 text-3xl font-bold ${
              walletAmount >= 0
                ? "text-purple-600 dark:text-purple-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            <span className="text-xl font-medium text-gray-300">$</span>
            {walletAmount.toLocaleString()}
          </span>
          <span className="text-xs text-blue-500 mt-1">Base: $ 5000</span>
        </div> */}
        <WalletDisplay />
      </div>
    </div>
  );
}
