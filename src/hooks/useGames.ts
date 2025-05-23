import { useQuery } from "@tanstack/react-query";

export const useGames = (params?: {
  shopId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["games", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.shopId) queryParams.append("shopId", params.shopId);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const res = await fetch(`/api/games?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch games");
      return res.json();
    },
  });
};

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const res = await fetch(`/api/games/${id}`);
      if (!res.ok) throw new Error("Failed to fetch game");
      return res.json();
    },
  });
};
