import { useEffect, useState, useRef, useCallback } from "react";
import { usePens } from "@/hooks/usePens";
import type { Piggery } from "@/types/pen";

export function useRealtimeFarms() {
  const { data: initialData, isLoading, isError } = usePens();
  const [farms, setFarms] = useState<Piggery[]>(initialData?.piggeies ?? []);
  const wsRef = useRef<WebSocket | null>(null);

  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);

  const MAX_RECONNECT_DELAY = 30000; // 최대 30초
  const BASE_DELAY = 1000; // 1초

  // 초기 데이터 세팅
  useEffect(() => {
    if (initialData?.piggeies) setFarms(initialData.piggeies);
  }, [initialData]);

  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_API_BASE_URL}?token=${token}`,
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttemptRef.current = 0; // 성공하면 초기화
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as { piggeies: Piggery[] };

        setFarms((prevFarms) =>
          message.piggeies.map((incomingFarm) => {
            const existingFarm = prevFarms.find(
              (f) => f.piggery_id === incomingFarm.piggery_id,
            );

            if (existingFarm) {
              return {
                ...existingFarm,
                ...incomingFarm,
                pens: incomingFarm.pens.map((incomingPen) => {
                  const existingPen = existingFarm.pens.find(
                    (p) => p.pen_id === incomingPen.pen_id,
                  );

                  if (existingPen) {
                    return {
                      ...existingPen,
                      ...incomingPen,
                      abnormal_pigs:
                        incomingPen.abnormal_pigs ?? existingPen.abnormal_pigs,
                    };
                  }

                  return incomingPen;
                }),
              };
            }

            return incomingFarm;
          }),
        );
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    ws.onclose = () => {
      if (isUnmountedRef.current) return;

      console.log("WebSocket disconnected. Reconnecting...");

      const attempt = reconnectAttemptRef.current;
      const delay = Math.min(BASE_DELAY * 2 ** attempt, MAX_RECONNECT_DELAY);

      reconnectTimeoutRef.current = window.setTimeout(() => {
        if (isUnmountedRef.current) return;
        reconnectAttemptRef.current += 1;
        connectWebSocket();
      }, delay);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    connectWebSocket();

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

  return { farms, isLoading, isError };
}
