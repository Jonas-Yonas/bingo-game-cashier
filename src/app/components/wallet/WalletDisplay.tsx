import { useBingoStore } from "@/app/stores/bingoStore";
import { useResolvedShopId } from "@/hooks/useResolvedShopId";
import { useEffect, useState } from "react";

export function WalletDisplay() {
  const shopId = useResolvedShopId();
  const balance = useBingoStore((state) => state.getWalletBalance());

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulateSync = async () => {
      try {
        await new Promise((res) => setTimeout(res, 5000)); // simulate delay
      } catch (err) {
        console.error("Failed to sync wallet", err);
      } finally {
        setLoading(false); // end loading
      }
    };

    simulateSync();
  }, [shopId]);

  return (
    <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xs">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Wallet
      </span>
      {loading ? (
        <div className="mt-1 h-8 w-20 animate-pulse bg-gray-200 rounded" />
      ) : (
        <span
          className={`flex items-center mt-1 text-3xl font-bold ${
            balance >= 0
              ? "text-purple-600 dark:text-purple-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          <span className="text-xl font-medium text-gray-300">$</span>
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
      <span className="text-xs text-blue-500 mt-1">
        Last sync: {new Date().toLocaleTimeString()}
      </span>
    </div>
  );
}
