import { create } from "zustand";

interface WalletTransaction {
  amount: number;
  type: "commission" | "topup" | "adjustment";
  timestamp: Date;
  note?: string;
}

interface BingoGameState {
  shopId: string | null;
  setShopId: (id: string) => void;

  players: number[];
  calledNumbers: number[];
  lockedNumbers: number[];
  gameStarted: boolean;

  betAmount: number;
  prizePool: number;
  shopCommission: number;
  systemCommission: number;
  initialWalletBalance: number;
  walletTransactions: WalletTransaction[];

  canStartGame: () => boolean;
  getWalletBalance: () => number;

  addPlayer: (playerId: number) => void;
  removePlayer: (playerId: number) => void;
  setPlayers: (players: number[]) => void;
  callNumber: (number: number) => void;
  resetCalledNumbers: () => void;
  addLockedNumber: (number: number) => void;
  startGame: () => void;
  resetGame: () => void;

  recalculatePrizePool: () => void;

  setBetAmount: (amount: number) => void;
  topUpWallet: (amount: number, note?: string) => void;

  playBingoSound: () => void;

  syncWallet: (shopId: string) => Promise<void>;
  prepareGame: () => void;
  startGameWithDeduction: (shopId: string) => Promise<void>;
}

export const useBingoStore = create<BingoGameState>((set, get) => ({
  shopId: null,
  setShopId: (id: string) => set({ shopId: id }),

  players: [],
  calledNumbers: [],
  lockedNumbers: [],
  gameStarted: false,

  betAmount: 30,
  prizePool: 0,
  shopCommission: 0,
  systemCommission: 0,
  initialWalletBalance: 0,
  walletTransactions: [],

  canStartGame: () => {
    const { players, getWalletBalance } = get();
    return players.length >= 2 && getWalletBalance() >= 0;
  },

  getWalletBalance: () => {
    const { initialWalletBalance, walletTransactions } = get();
    return (
      initialWalletBalance +
      walletTransactions.reduce((sum, txn) => sum + txn.amount, 0)
    );
  },

  addPlayer: (playerId) => {
    if (get().gameStarted) return;
    set((state) => {
      const updatedPlayers = state.players.includes(playerId)
        ? state.players
        : [...state.players, playerId];
      return { players: updatedPlayers };
    });
    get().recalculatePrizePool(); // Update prize pool after adding
  },

  removePlayer: (playerId) => {
    if (get().gameStarted) return;
    set((state) => ({
      players: state.players.filter((id) => id !== playerId),
    }));
    get().recalculatePrizePool(); // Update prize pool after removing
  },

  setPlayers: (players) => {
    set({ players });
    get().recalculatePrizePool();
  },

  callNumber: (number) =>
    set((state) => ({
      calledNumbers: [...state.calledNumbers, number],
    })),

  resetCalledNumbers: () => set({ calledNumbers: [], lockedNumbers: [] }),

  addLockedNumber: (number) =>
    set((state) => ({
      lockedNumbers: [...state.lockedNumbers, number],
    })),

  startGame: async () => {
    const { players, betAmount, getWalletBalance, gameStarted, shopId } = get();
    if (players.length === 0 || gameStarted || !shopId) return;

    const totalBet = players.length * betAmount;
    const shopCommission = totalBet * 0.2;
    const systemCommission = shopCommission * 0.2;

    if (getWalletBalance() < systemCommission) {
      alert("Not enough balance to start the game!");
      return;
    }

    try {
      // Make API call to record transaction
      const response = await fetch(`/api/shops/${shopId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: -systemCommission,
          type: "commission",
          note: `System commission for ${players.length} players`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record transaction");
      }

      // Update local state only after successful API call
      set((state) => ({
        gameStarted: true,
        prizePool: totalBet - shopCommission,
        shopCommission,
        systemCommission,
        walletTransactions: [
          ...state.walletTransactions,
          {
            amount: -systemCommission,
            type: "commission",
            timestamp: new Date(),
            note: `System commission deducted from ${players.length} players`,
          },
        ],
      }));
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Failed to start game. Please try again.");
    }
  },

  resetGame: () => {
    set({
      players: [],
      calledNumbers: [],
      lockedNumbers: [],
      gameStarted: false,
      prizePool: 0,
      shopCommission: 0,
      systemCommission: 0,
    });
  },

  setBetAmount: (amount) => {
    if (get().gameStarted) return;
    set({ betAmount: Math.max(1, amount) }); // Just update, no finance logic here!
  },

  recalculatePrizePool: () => {
    const { players, betAmount } = get();
    const totalBet = players.length * betAmount;
    const shopCommission = totalBet * 0.2;
    const systemCommission = shopCommission * 0.2;
    const prizePool = totalBet - shopCommission;

    set({
      prizePool,
      shopCommission,
      systemCommission,
    });
  },

  topUpWallet: (amount, note) =>
    set((state) => ({
      walletTransactions: [
        ...state.walletTransactions,
        {
          amount,
          type: "topup",
          timestamp: new Date(),
          note: note || "Admin top-up",
        },
      ],
    })),

  playBingoSound: () => {
    const audio = new Audio("/audios/bingo.mp3");
    audio.play().catch((e) => console.error("Audio play failed:", e));
  },

  syncWallet: async (shopId) => {
    try {
      const res = await fetch(`/api/shops/${shopId}/wallet`);
      const data = await res.json();
      set({
        initialWalletBalance: data.balance,
        walletTransactions: data.transactions || [],
      });
    } catch (error) {
      console.error("Failed to sync wallet:", error);
    }
  },

  prepareGame: () => {
    const { players, betAmount } = get();
    const totalBet = players.length * betAmount;
    const shopCommission = totalBet * 0.2;
    const systemCommission = shopCommission * 0.2;

    set({
      prizePool: totalBet - shopCommission,
      shopCommission,
      systemCommission,
      // Don't deduct yet, just calculate
    });
  },

  startGameWithDeduction: async (shopId) => {
    const { systemCommission, players } = get();
    if (!shopId) throw new Error("No shop ID");

    try {
      // Make API call to record transaction
      const response = await fetch(`/api/shops/${shopId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: -systemCommission,
          type: "commission",
          note: `System commission for ${players.length} players`,
        }),
      });

      if (!response.ok) throw new Error("Failed to record transaction");

      // Update local state
      set({
        gameStarted: true,
        walletTransactions: [
          ...get().walletTransactions,
          {
            amount: -systemCommission,
            type: "commission",
            timestamp: new Date(),
            note: `System commission for ${players.length} players`,
          },
        ],
      });
    } catch (error) {
      console.error("Deduction failed:", error);
      // Optionally reset game state if deduction fails
      get().resetGame();
      throw error;
    }
  },
}));
