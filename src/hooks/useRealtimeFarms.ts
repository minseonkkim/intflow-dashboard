import { useEffect, useRef, useState, useCallback } from "react";
import { usePens } from "@/hooks/usePens";
import type { Piggery } from "@/types/pen";

export function useRealtimeFarms() {
  const { data: initialData, isLoading, isError } = usePens();
  const [realtimeFarms, setRealtimeFarms] = useState<Piggery[] | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);
  const connectRef = useRef<(() => void) | null>(null);

  const MAX_RECONNECT_DELAY = 30000;
  const BASE_DELAY = 1000;

  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const wsBaseUrl = import.meta.env.VITE_WS_API_BASE_URL;
    const separator = wsBaseUrl.includes("?") ? "&" : "?";
    const ws = new WebSocket(
      `${wsBaseUrl}${separator}token=${encodeURIComponent(token)}`,
    );
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as {
          piggeies?: Piggery[];
          piggeries?: Piggery[];
        };
        const incomingFarms = Array.isArray(message.piggeies)
          ? message.piggeies
          : message.piggeries;
        if (!Array.isArray(incomingFarms)) return;

        setRealtimeFarms((prevFarms) => {
          const safePrevFarms = Array.isArray(prevFarms) ? prevFarms : [];

          return incomingFarms.map((incomingFarm) => {
            const incomingPens = Array.isArray(incomingFarm.pens)
              ? incomingFarm.pens
              : [];
            const existingFarm = safePrevFarms.find(
              (farm) => farm.piggery_id === incomingFarm.piggery_id,
            );

            if (!existingFarm) {
              return {
                ...incomingFarm,
                pens: incomingPens,
              };
            }

            const existingPens = Array.isArray(existingFarm.pens)
              ? existingFarm.pens
              : [];

            return {
              ...existingFarm,
              ...incomingFarm,
              pens: incomingPens.map((incomingPen) => {
                const existingPen = existingPens.find(
                  (pen) => pen.pen_id === incomingPen.pen_id,
                );

                if (!existingPen) return incomingPen;

                return {
                  ...existingPen,
                  ...incomingPen,
                  abnormal_pigs:
                    incomingPen.abnormal_pigs ?? existingPen.abnormal_pigs,
                };
              }),
            };
          });
        });
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onclose = () => {
      if (isUnmountedRef.current) return;

      const attempt = reconnectAttemptRef.current;
      const delay = Math.min(BASE_DELAY * 2 ** attempt, MAX_RECONNECT_DELAY);

      reconnectTimeoutRef.current = window.setTimeout(() => {
        if (isUnmountedRef.current) return;
        reconnectAttemptRef.current += 1;
        connectRef.current?.();
      }, delay);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };
  }, []);

  useEffect(() => {
    connectRef.current = connectWebSocket;
    isUnmountedRef.current = false;
    connectRef.current?.();

    return () => {
      isUnmountedRef.current = true;

      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  const farms = realtimeFarms ?? initialData?.piggeies ?? [];
  return { farms, isLoading, isError };
}
