export type Shop = {
  id: string;
  name: string;
  location: string;
  cashierName: string;
  shopCommission: number;
  systemCommission: number;
  walletBalance: number;
  shopId: number;
};

export type Cashier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "AVAILABLE" | "ON_BREAK" | "OFF_DUTY";
  createdAt: Date | string;
  isActive?: boolean;
};

export type Transaction = {
  id: string;
  shopName: string;
  amount: number;
  type: "TOP UP" | "DEBIT";
  description: string;
  createdAt: Date | string;
};
