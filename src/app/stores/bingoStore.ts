import { create } from "zustand";

interface WalletTransaction {
  amount: number;
  type: "commission" | "topup" | "adjustment";
  timestamp: Date;
  note?: string;
}

interface BingoGameState {
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
}

export const useBingoStore = create<BingoGameState>((set, get) => ({
  players: [],
  calledNumbers: [],
  lockedNumbers: [],
  gameStarted: false,

  betAmount: 30,
  prizePool: 0,
  shopCommission: 0,
  systemCommission: 0,
  initialWalletBalance: 5000,
  walletTransactions: [],

  canStartGame: () => {
    const { players, getWalletBalance } = get();
    return players.length > 0 && getWalletBalance() >= 0;
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
    get().recalculatePrizePool(); // 🔁 Update prize pool after adding
  },

  removePlayer: (playerId) => {
    if (get().gameStarted) return;
    set((state) => ({
      players: state.players.filter((id) => id !== playerId),
    }));
    get().recalculatePrizePool(); // 🔁 Update prize pool after removing
  },

  //   setPlayers: (players) => set({ players }),

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

  startGame: () => {
    const { players, betAmount, getWalletBalance, gameStarted } = get();
    if (players.length === 0 || gameStarted) return;

    const totalBet = players.length * betAmount;
    const shopCommission = totalBet * 0.2;
    const systemCommission = shopCommission * 0.2;

    if (getWalletBalance() < systemCommission) {
      alert("Not enough balance to start the game!");
      return;
    }

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
    set({ betAmount: Math.max(1, amount) }); // ✅ Just update, no finance logic here!
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
}));
