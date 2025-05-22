import { create } from "zustand";

interface AuthState {
  userId: string | null;
  email: string | null;
  shopId: string | null;
  isLoggedIn: boolean;

  login: (data: { userId: string; email: string; shopId: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  shopId: null,
  isLoggedIn: false,

  login: ({ userId, email, shopId }) => {
    set({ userId, email, shopId, isLoggedIn: true });
  },

  logout: () => {
    set({ userId: null, email: null, shopId: null, isLoggedIn: false });
  },
}));
