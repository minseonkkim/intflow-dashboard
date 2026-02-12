import { useQuery } from "@tanstack/react-query";
import type { PenDetailResponse, PenDetailTimeSeriesPoint } from "@/types/pen";

function waitWithAbort(delay: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delay);

    const onAbort = () => {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      reject(new DOMException("Request aborted", "AbortError"));
    };

    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort);
    }
  });
}

async function fetchPenDetail(
  roomId: number,
  token: string,
  signal?: AbortSignal,
): Promise<PenDetailResponse> {
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
          signal,
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: unknown = await response.json();

      if (!isPenDetailResponse(data)) {
        throw new Error("Invalid response structure");
      }

      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      attempt++;
      if (attempt >= maxRetries) throw error;

      const delay = 1000 * Math.pow(2, attempt);
      await waitWithAbort(delay, signal);
    }
  }

  throw new Error("Failed to fetch pen detail");
}

function isPenDetailResponse(value: unknown): value is PenDetailResponse {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<PenDetailResponse>;
  if (typeof candidate.name !== "string") return false;
  if (!Array.isArray(candidate.time_series)) return false;

  return candidate.time_series.every(isPenDetailTimeSeriesPoint);
}

function isPenDetailTimeSeriesPoint(
  value: unknown,
): value is PenDetailTimeSeriesPoint {
  if (!value || typeof value !== "object") return false;

  const point = value as Partial<PenDetailTimeSeriesPoint>;
  return (
    typeof point.activity === "number" &&
    typeof point.feeding_time === "number"
  );
}

export function usePenDetail(roomId: number) {
  const token = localStorage.getItem("accessToken") ?? "";

  return useQuery({
    queryKey: ["penDetail", roomId],
    queryFn: ({ signal }) => fetchPenDetail(roomId, token, signal),
    enabled: !!roomId,
  });
}
