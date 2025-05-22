// hooks/useCashierShop.ts
import { useEffect, useState } from "react";

export function useCashierShop() {
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const response = await fetch("/api/cashier/me");
        const data = await response.json();
        setShopId(data.shopId);
      } catch (error) {
        console.error("Failed to fetch cashier's shop:", error);
      }
    };

    fetchShopId();
  }, []);

  return shopId;
}
