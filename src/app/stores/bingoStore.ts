import { create } from "zustand";

interface BingoGameState {
  players: number[];
  calledNumbers: number[];
  lockedNumbers: number[];
  addPlayer: (playerId: number) => void;
  removePlayer: (playerId: number) => void;
  setPlayers: (players: number[]) => void;
  callNumber: (number: number) => void;
  resetCalledNumbers: () => void;
  addLockedNumber: (number: number) => void;
}

export const useBingoStore = create<BingoGameState>((set) => ({
  players: [],
  calledNumbers: [],
  lockedNumbers: [],
  addPlayer: (playerId) =>
    set((state) => ({ players: [...state.players, playerId] })),
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((id) => id !== playerId),
    })),
  setPlayers: (players) => set({ players }),
  callNumber: (number) =>
    set((state) => ({
      calledNumbers: [...state.calledNumbers, number],
    })),
  resetCalledNumbers: () => set({ calledNumbers: [], lockedNumbers: [] }),
  addLockedNumber: (number) =>
    set((state) => ({
      lockedNumbers: [...state.lockedNumbers, number],
    })),
}));
