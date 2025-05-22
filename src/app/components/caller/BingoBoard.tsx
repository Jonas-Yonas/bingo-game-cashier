"use client";

interface BingoBoardProps {
  calledNumbers: number[];
  currentCall: string | null;
  flickerNumbers: Set<number>;
  getLetterForNumber: (num: number) => string;
}

export function BingoBoard({
  calledNumbers,
  currentCall,
  flickerNumbers,
  getLetterForNumber,
}: BingoBoardProps) {
  const numberRows = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 15 }, (_, col) => row * 15 + col + 1)
  );

  return (
    <div className="flex-1 flex relative min-w-0">
      {/* Bingo Letters - Left */}
      <div className="w-8 flex flex-col px-6">
        {["B", "I", "N", "G", "O"].map((letter) => (
          <div
            key={`left-${letter}`}
            className="h-[20%] flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <div className="text-4xl font-black text-gray-800 dark:text-blue-600">
              {letter}
            </div>
          </div>
        ))}
      </div>

      {/* Numbers Grid */}
      <div className="flex-1 flex flex-col gap-y-1 pt-1">
        {numberRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-1 gap-x-1">
            {row.map((num) => (
              <div
                key={num}
                className={`flex-1 flex items-center justify-center text-3xl font-bold border border-gray-300 dark:border-gray-600 rounded-sm
                  ${
                    calledNumbers.includes(num)
                      ? "bg-emerald-600 text-gray-200"
                      : "bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }
                  ${
                    currentCall === `${getLetterForNumber(num)}${num}`
                      ? "ring-2 ring-yellow-500 shadow-lg animate-pulse"
                      : ""
                  }
                  ${
                    flickerNumbers.has(num)
                      ? "shadow-[0_0_10px_3px_rgba(255,192,203,0.75)]"
                      : ""
                  }
                `}
              >
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bingo Letters - Right */}
      <div className="w-8 flex flex-col px-6">
        {["B", "I", "N", "G", "O"].map((letter) => (
          <div
            key={`right-${letter}`}
            className="h-[20%] flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <div className="text-4xl font-black text-gray-800 dark:text-blue-600 rounded-md">
              {letter}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
