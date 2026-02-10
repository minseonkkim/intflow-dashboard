import { useQuery } from "@tanstack/react-query";
import { fetchPens } from "@/api/pen";

export const usePens = () => {
  return useQuery({
    queryKey: ["pens"],
    queryFn: fetchPens,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};
