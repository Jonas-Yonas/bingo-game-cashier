"use client";

import { useEffect, useState } from "react";
import { BINGO_CARDS } from "../lib/utils";
import { useBingoStore } from "../stores/bingoStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface WinnerModalProps {
  cardNumber: string;
  lastCalledNumber: string | null;
  onClose: () => void;
}

export default function WinnerModal({
  cardNumber,
  lastCalledNumber,
  onClose,
}: WinnerModalProps) {
  const {
    calledNumbers,
    removePlayer,
    addLockedNumber,
    lockedNumbers,
    playBingoSound,
  } = useBingoStore();

  const [cardNumbers, setCardNumbers] = useState<number[]>([]);
  const [winnerPatterns, setWinnerPatterns] = useState<string[]>([]);
  const [matchedCells, setMatchedCells] = useState<Set<number>>(new Set());

  const lastCalledValue = lastCalledNumber
    ? parseInt(lastCalledNumber.replace(/[BINGO]/, ""))
    : null;

  useEffect(() => {
    const cardData = BINGO_CARDS[cardNumber as keyof typeof BINGO_CARDS] || [];
    setCardNumbers(cardData);
    checkWinningPatterns(cardData);
  }, [cardNumber, calledNumbers, lastCalledValue]);

  const isNumberCalled = (num: number) =>
    num === 0 || calledNumbers.includes(num);

  const checkWinningPatterns = (cardNums: number[]) => {
    const patterns: string[] = [];
    const matchedIndexes = new Set<number>();

    const addPatternIfValid = (indexes: number[], label: string) => {
      const nums = indexes.map((i) => cardNums[i]);
      const isAllCalled = nums.every(isNumberCalled);
      const includesLastCalled =
        lastCalledValue !== null && nums.includes(lastCalledValue!);

      if (isAllCalled && includesLastCalled) {
        patterns.push(label);
        indexes.forEach((i) => matchedIndexes.add(i));
      }
    };

    // Horizontal lines
    for (let i = 0; i < 25; i += 5) {
      const indexes = [i, i + 1, i + 2, i + 3, i + 4];
      addPatternIfValid(indexes, `Horizontal Line ${i / 5 + 1}`);
    }

    // Vertical lines
    for (let i = 0; i < 5; i++) {
      const indexes = [i, i + 5, i + 10, i + 15, i + 20];
      addPatternIfValid(indexes, `Vertical Line ${i + 1}`);
    }

    // Diagonals
    addPatternIfValid([0, 6, 12, 18, 24], "Diagonal (↘)");
    addPatternIfValid([4, 8, 12, 16, 20], "Diagonal (↙)");

    // Corners
    addPatternIfValid([0, 4, 20, 24], "Four Corners");

    setWinnerPatterns(patterns);
    setMatchedCells(matchedIndexes);

    if (patterns.length >= 3) playBingoSound();
  };

  const handleLockCard = () => {
    toast.warning("Card locked :( ");

    addLockedNumber(Number(cardNumber));
    removePlayer(Number(cardNumber));
    onClose();
  };

  const isCardLocked = lockedNumbers.includes(Number(cardNumber));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:px-12 max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <h3 className="text-2xl font-bold text-center mb-6">
          {isCardLocked ? (
            <span className="text-red-500">🔒 Card Locked</span>
          ) : winnerPatterns.length >= 3 ? (
            <span className="text-green-600 animate-pulse">
              🎉 You're a Winner! 🎉
            </span>
          ) : winnerPatterns.length > 0 ? (
            <span className="text-yellow-500">Not a Winner!</span>
          ) : (
            <span className="text-red-500">No Winning Patterns</span>
          )}
        </h3>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 mb-4 text-sm sm:text-base">
          <p>
            <strong>Card:</strong> {cardNumber}
          </p>
          {!isCardLocked && (
            <>
              <p>
                <strong>Matched:</strong>{" "}
                {cardNumbers.filter(isNumberCalled).length}/25
              </p>
              <p>
                <strong>Called:</strong> {calledNumbers.length}/75
              </p>
            </>
          )}
          {lastCalledNumber && (
            <p>
              <strong>Last:</strong>{" "}
              <span className="text-yellow-600">{lastCalledNumber}</span>
            </p>
          )}
        </div>

        {!isCardLocked && (
          <div className="grid grid-cols-5 gap-2 mb-6">
            {cardNumbers.map((num, index) => {
              const isCalled = isNumberCalled(num);
              const isLast = num === lastCalledValue;
              const isMatch = matchedCells.has(index);

              return (
                <div
                  key={index}
                  className={`p-2 sm:p-3 text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-md text-center relative transition-all
                    ${
                      isMatch
                        ? "bg-yellow-400 text-black font-bold"
                        : isCalled
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    }
                    ${isLast ? "ring-2 ring-yellow-400 animate-pulse" : ""}
                  `}
                >
                  {num === 0 ? "FREE" : num}
                  {isLast && (
                    <div className="absolute -top-2 -right-2 bg-lime-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow">
                      !
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isCardLocked && winnerPatterns.length > 0 && (
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium">
                    Matched Patterns ({winnerPatterns.length})
                  </button>
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="center"
                className="w-72 max-h-60 overflow-y-auto space-y-1 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-lg shadow-lg"
              >
                <h4 className="font-semibold mb-2">Matched Patterns:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {winnerPatterns.map((pattern, i) => (
                    <li key={i}>{pattern}</li>
                  ))}
                </ul>

                {winnerPatterns.length >= 3 && (
                  <div className="mt-3 text-center text-emerald-700 font-bold text-lg animate-bounce">
                    ✨ Super Win! ✨
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="mt-auto flex justify-between pt-3 border-t">
          {!isCardLocked && (
            <button
              onClick={handleLockCard}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-base"
            >
              Lock Card
            </button>
          )}
          <button
            onClick={onClose}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-base ${
              isCardLocked ? "w-full" : ""
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
