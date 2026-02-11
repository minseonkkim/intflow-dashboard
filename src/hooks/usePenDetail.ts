import { useQuery } from "@tanstack/react-query";

async function fetchPenDetail(roomId: number, token: string) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pens/${roomId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (!data || !Array.isArray(data.time_series)) {
        throw new Error("Invalid response structure");
      }

      return data;
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;

      const delay = 1000 * Math.pow(2, attempt);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export function usePenDetail(roomId: number) {
  const token = localStorage.getItem("accessToken") ?? "";

  return useQuery({
    queryKey: ["penDetail", roomId],
    queryFn: () => fetchPenDetail(roomId, token),
    enabled: !!roomId,
  });
}
