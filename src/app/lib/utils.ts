import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Handles empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// bingoCardGenerator
export const generateBingoCards = (count: number) => {
  const cards: Record<string, number[]> = {};

  for (let i = 1; i <= count; i++) {
    const card: number[] = [];

    // Generate numbers for each column according to BINGO rules
    const ranges = [
      { letter: "B", min: 1, max: 15 },
      { letter: "I", min: 16, max: 30 },
      { letter: "N", min: 31, max: 45 },
      { letter: "G", min: 46, max: 60 },
      { letter: "O", min: 61, max: 75 },
    ];

    // Generate 5 numbers for each column (except N which has 4 + free space)
    ranges.forEach((range, colIndex) => {
      const numbers: number[] = [];
      const count = colIndex === 2 ? 4 : 5; // N column has 4 numbers + free space

      while (numbers.length < count) {
        const num =
          Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }

      // Sort numbers and add to card
      numbers.sort((a, b) => a - b).forEach((num) => card.push(num));

      // Add free space in the middle (N column, 3rd row)
      if (colIndex === 2) {
        card.splice(12, 0, 0); // 0 represents free space
      }
    });

    cards[i.toString()] = card;
  }

  return cards;
};

// Pre-generate 200 cards (you can save this to a JSON file)
export const BINGO_CARDS = generateBingoCards(200);
