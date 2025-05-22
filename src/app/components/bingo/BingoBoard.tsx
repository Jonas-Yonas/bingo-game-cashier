"use client";

interface BingoBoardProps {
  numbers: number[];
  selectedNumbers: number[];
  onNumberClick: (number: number) => void;
}

export function BingoBoard({
  numbers,
  selectedNumbers,
  onNumberClick,
}: BingoBoardProps) {
  return (
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
              onClick={() => onNumberClick(number)}
              className={`aspect-square w-full flex items-center justify-center rounded text-white font-semibold text-lg transition-all ${
                selectedNumbers.includes(number)
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
  );
}
