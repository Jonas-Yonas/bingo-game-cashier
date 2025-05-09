export const ROLES = {
  CASHIER: "CASHIER",
  USER: "USER",
} as const;

export type Role = keyof typeof ROLES;
