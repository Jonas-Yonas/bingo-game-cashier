import { useCashierShop } from "@/hooks/useCashierShop";

export function useResolvedShopId() {
  const shopId = useCashierShop();
  return shopId || localStorage.getItem("shopId");
}
