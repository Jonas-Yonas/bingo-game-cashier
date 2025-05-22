"use client";

import { BingoBall } from "../BingoBalls";

interface BingoSidebarProps {
  calledNumbers: number[];
  currentCall: string | null;
}

export function BingoSidebar({
  calledNumbers,
  currentCall,
}: BingoSidebarProps) {
  return (
    <div className="w-40 bg-white dark:bg-gray-800 p-2 flex flex-col border-r border-gray-200 dark:border-gray-700 pt-10">
      <div className="flex justify-between mb-3">
        <div className="text-center">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Total
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {calledNumbers.length}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Last
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {currentCall || "--"}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-1">
        <BingoBall />

        <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1 text-center">
          BINGO <br />
          <span className="text-2xl text-yellow-500">BLAST</span>
        </div>
      </div>
    </div>
  );
}
