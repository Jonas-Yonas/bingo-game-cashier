export const ROLES = {
  CASHIER: "CASHIER",
  USER: "USER",
} as const;

export type Role = keyof typeof ROLES;

export interface Game {
  id: string;
  shopId: string;
  status: "active" | "completed";
  betAmount: number;
  players: string[]; // Player IDs
  timestamp: Date;
  winningAmount?: number;
  winnerCard?: string;
  winnerPlayerId?: string;
  calledNumbers: number[];
  shopCommission: number;
  systemCommission: number;
  endedAt?: Date;
}
