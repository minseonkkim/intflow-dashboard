import { useEffect, useState } from "react";
import { ResilientWebSocket } from "@/utils/ResilientWebSocket";
import type { PenRealtimeMessage } from "@/types/pen";

export function usePenRealtime(penId: number) {
  const [realtimeData, setRealtimeData] = useState<PenRealtimeMessage | null>(
    null,
  );

  useEffect(() => {
    if (!penId) return;

    const token = localStorage.getItem("accessToken");
    const wsUrl = `${import.meta.env.VITE_WS_API_BASE_URL}/${penId}?token=${token}`;

    const socket = new ResilientWebSocket<PenRealtimeMessage>(
      wsUrl,
      (message) => {
        setRealtimeData(message);
      },
    );

    return () => {
      socket.close();
    };
  }, [penId]);

  return realtimeData;
}
