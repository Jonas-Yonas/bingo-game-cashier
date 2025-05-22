import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBingoStore } from "@/app/stores/bingoStore";

export const useShopWallet = (shopId: string) => {
  const { initialWalletBalance, walletTransactions, getWalletBalance } =
    useBingoStore();

  // Fetch initial balance from DB
  const { data: dbWallet, refetch } = useQuery({
    queryKey: ["shop-wallet", shopId],
    queryFn: async () => {
      const res = await fetch(`/api/shops/${shopId}/wallet`);
      if (!res.ok) throw new Error("Failed to fetch wallet");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Sync with local store
  useEffect(() => {
    if (dbWallet) {
      useBingoStore.setState({
        initialWalletBalance: dbWallet.balance,
        walletTransactions: dbWallet.transactions || [],
      });
    }
  }, [dbWallet]);

  return {
    balance: getWalletBalance(),
    isLoading: !dbWallet,
    refetch,
    transactions: walletTransactions,
  };
};
