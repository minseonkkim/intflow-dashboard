import { useEffect, useState } from "react";
import { ResilientWebSocket } from "@/utils/ResilientWebSocket";
import type { PenRealtimeMessage, PenRealtimeSample } from "@/types/pen";

interface UsePenRealtimeResult {
  latest: PenRealtimeMessage | null;
  samples: PenRealtimeSample[];
}

export function usePenRealtime(penId: number): UsePenRealtimeResult {
  const [latest, setLatest] = useState<PenRealtimeMessage | null>(null);
  const [samples, setSamples] = useState<PenRealtimeSample[]>([]);

  useEffect(() => {
    if (!penId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const wsUrl = `${import.meta.env.VITE_WS_API_BASE_URL}/${penId}?token=${encodeURIComponent(token)}`;

    const socket = new ResilientWebSocket<PenRealtimeMessage>(
      wsUrl,
      (message) => {
        setLatest(message);

        if (!message?.data) return;

        const sample: PenRealtimeSample = {
          activity: message.data.activity,
          feeding_time: message.data.feeding_time,
          timestamp: new Date().toLocaleTimeString("en-GB"),
        };

        setSamples((prev) => [...prev, sample].slice(-10));
      },
    );

    return () => {
      socket.close();
    };
  }, [penId]);

  return { latest, samples };
}
