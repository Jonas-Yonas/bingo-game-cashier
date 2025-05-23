import { create } from "zustand";

type GameStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

interface Game {
  id: string | null;
  shopId: string | null;
  status: GameStatus;
  betAmount: number;
  players: string[];
  calledNumbers: number[];
  lockedNumbers: number[];
  prizePool: number;
  shopCommission: number;
  systemCommission: number;
  winnerCard: string | null;
  winnerPlayerId: string | null;
  timestamp: Date | null;
  endedAt: Date | null;
}

interface GameStore {
  currentGame: Game;
  isSaving: boolean;
  error: string | null;
  createGame: (
    shopId: string,
    betAmount: number,
    players: string[]
  ) => Promise<void>;
  updateGameNumbers: (
    calledNumbers: number[],
    lockedNumbers: number[]
  ) => Promise<void>;
  endGame: (winnerCard?: string, winnerPlayerId?: string) => Promise<void>;
  resetGame: () => void;
}

const initialState: Game = {
  id: null,
  shopId: null,
  status: "ACTIVE",
  betAmount: 0,
  players: [],
  calledNumbers: [],
  lockedNumbers: [],
  prizePool: 0,
  shopCommission: 0,
  systemCommission: 0,
  winnerCard: null,
  winnerPlayerId: null,
  timestamp: null,
  endedAt: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: { ...initialState },
  isSaving: false,
  error: null,

  createGame: async (shopId, betAmount, players) => {
    set({ isSaving: true, error: null });

    try {
      // Calculate values
      const totalBet = players.length * betAmount;
      const shopCommission = totalBet * 0.2;
      const systemCommission = shopCommission * 0.2;
      const prizePool = totalBet - shopCommission;

      // API call
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          betAmount,
          players,
          prizePool,
          shopCommission,
          systemCommission,
        }),
      });

      if (!response.ok) throw new Error("Failed to create game");

      const gameData = await response.json();

      // Update state
      set({
        currentGame: {
          ...gameData,
          status: "ACTIVE",
          calledNumbers: [],
          lockedNumbers: [],
        },
        isSaving: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create game",
        isSaving: false,
      });
    }
  },

  updateGameNumbers: async (calledNumbers, lockedNumbers) => {
    const { currentGame } = get();
    if (!currentGame.id) return;

    set({ isSaving: true });

    try {
      await fetch(`/api/games/${currentGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calledNumbers, lockedNumbers }),
      });

      set({
        currentGame: {
          ...currentGame,
          calledNumbers,
          lockedNumbers,
        },
        isSaving: false,
      });
    } catch (error) {
      set({ isSaving: false });
      console.error("Failed to update game:", error);
    }
  },

  endGame: async (winnerCard, winnerPlayerId) => {
    const { currentGame } = get();
    if (!currentGame.id) return;

    set({ isSaving: true });

    try {
      const endedAt = new Date();
      const response = await fetch(`/api/games/${currentGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          endedAt,
          winnerCard,
          winnerPlayerId,
        }),
      });

      if (!response.ok) throw new Error("Failed to end game");

      set({
        currentGame: {
          ...currentGame,
          status: "COMPLETED",
          endedAt,
          winnerCard: winnerCard || null,
          winnerPlayerId: winnerPlayerId || null,
        },
        isSaving: false,
      });
    } catch (error) {
      set({ isSaving: false });
      console.error("Failed to end game:", error);
    }
  },

  resetGame: () => {
    set({
      currentGame: { ...initialState },
      error: null,
    });
  },
}));
