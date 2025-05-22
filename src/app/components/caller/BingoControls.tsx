"use client";

import { PreviewPlayersDialog } from "../CustomPreviewDialog";

interface BingoControlsProps {
  calledNumbers: number[];
  currentCall: string | null;
  isAutoPlaying: boolean;
  prizePool: number;
  players: number[];
  cardNumber: string;
  callerLanguage: string;
  onStartAutoPlay: () => void;
  onPauseAutoPlay: () => void;
  onShuffleNumbers: () => void;
  onReset: () => void;
  onCheckWinner: () => void;
  onCardNumberChange: (value: string) => void;
  onCallerLanguageChange: (value: string) => void;
  onPreviewActivePlayers: () => void;
}

export function BingoControls({
  calledNumbers,
  currentCall,
  isAutoPlaying,
  prizePool,
  players,
  cardNumber,
  callerLanguage,
  onStartAutoPlay,
  onPauseAutoPlay,
  onShuffleNumbers,
  onReset,
  onCheckWinner,
  onCardNumberChange,
  onCallerLanguageChange,
  onPreviewActivePlayers,
}: BingoControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 h-32 mt-8">
      <div className="max-w-5xl mx-auto grid grid-cols-4 gap-2 h-24 py-2">
        {/* Current Call Display */}
        <div className="flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center 
                  ring-8 ring-blue-400 ring-offset-4 ring-offset-white shadow-xl"
          >
            <span className="text-3xl font-extrabold text-white drop-shadow-md">
              {currentCall || "?"}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={onStartAutoPlay}
            disabled={isAutoPlaying || calledNumbers.length === 75}
            className="bg-green-600 hover:bg-green-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
          >
            Start Auto
          </button>
          <button
            onClick={onPauseAutoPlay}
            disabled={!isAutoPlaying}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
          >
            Pause
          </button>
          <button
            onClick={onShuffleNumbers}
            disabled={calledNumbers.length !== 0}
            className="bg-pink-600 hover:bg-pink-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
          >
            Shuffle
          </button>
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-0.5 rounded text-xs"
          >
            Reset
          </button>
        </div>

        {/* Right Controls */}
        <div className="grid grid-cols-1 gap-1 w-full">
          <div className="flex gap-1 h-10">
            <select
              value={callerLanguage}
              onChange={(e) => onCallerLanguageChange(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xs"
            >
              <option value="English">English</option>
              <option value="Amharic">Amharic</option>
            </select>
          </div>

          <div className="flex gap-1 h-10">
            <div className="flex justify-between">
              <input
                type="number"
                value={cardNumber}
                onChange={(e) => onCardNumberChange(e.target.value)}
                placeholder="Card #"
                className="flex bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xl rounded-r-none w-1/2"
                min="1"
              />
              <button
                onClick={onCheckWinner}
                disabled={!cardNumber}
                className="bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 rounded-l-none rounded text-xs disabled:bg-gray-400 w-1/2"
              >
                Check Winner
              </button>
            </div>
          </div>
        </div>

        {/* Current Amount to Bet */}
        <div className="flex items-center justify-end">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center ring-8 ring-blue-400           ring-offset-4 ring-offset-white shadow-lg animate-pulse transform transition duration-500 ease-in-out">
            <PreviewPlayersDialog
              trigger={
                <button
                  className="px-6 py-3 rounded-lg"
                  onClick={onPreviewActivePlayers}
                >
                  <span className="text-2xl font-extrabold text-white drop-shadow-lg select-none">
                    {prizePool < 1000
                      ? prizePool
                      : Math.round(prizePool / 1000) + "K"}
                  </span>
                </button>
              }
            />

            {/* Player count badge */}
            {players.length > 0 && (
              <div
                className="absolute -top-2 -right-6 bg-red-500 text-white text-xs 
                     font-bold rounded-full w-6 h-6 p-4 flex items-center justify-center
                     shadow-md animate-bounce"
              >
                {players.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
