import { useQuery } from "@tanstack/react-query";

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
) {
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

      const data = await response.json();

      if (!data || !Array.isArray(data.time_series)) {
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
}

export function usePenDetail(roomId: number) {
  const token = localStorage.getItem("accessToken") ?? "";

  return useQuery({
    queryKey: ["penDetail", roomId],
    queryFn: ({ signal }) => fetchPenDetail(roomId, token, signal),
    enabled: !!roomId,
  });
}
