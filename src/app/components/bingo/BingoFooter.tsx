"use client";

interface BingoFooterProps {
  canStartGame: boolean;
  isStarting: boolean;
  onClearSelection: () => void;
  onStartGame: () => void;
}

export function BingoFooter({
  canStartGame,
  isStarting,
  onClearSelection,
  onStartGame,
}: BingoFooterProps) {
  console.log(canStartGame);

  return (
    <div className="p-4 flex flex-col items-center gap-3">
      <div className="flex gap-6">
        <button
          onClick={onClearSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-colors"
        >
          Clear Selection
        </button>
        <button
          onClick={onStartGame}
          disabled={!canStartGame}
          className={`px-10 py-3 rounded-lg text-sm font-medium shadow-md transition-colors ${
            canStartGame
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isStarting ? "Starting..." : "Start Game"}
        </button>
      </div>
    </div>
  );
}
