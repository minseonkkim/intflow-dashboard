import { useEffect, useState, useRef } from "react";
import { usePens } from "@/hooks/usePens";

interface Pig {
  wid: number;
  thumbnail_url: string;
  activity: number;
  feeding_time: number;
}

interface Pen {
  pen_id: string;
  pen_name: string;
  current_pig_count: number;
  avg_activity_level: number;
  avg_feeding_time_minutes: number;
  avg_temperature_celsius: number;
  abnormal_pigs: Pig[];
}

interface Farm {
  piggery_id: string;
  piggery_name: string;
  total_pigs: number;
  pens: Pen[];
}

export function useRealtimeFarms() {
  const { data: initialData, isLoading, isError } = usePens();
  const [farms, setFarms] = useState<Farm[]>(initialData?.piggeies ?? []);
  const wsRef = useRef<WebSocket | null>(null);

  // 초기 데이터 세팅
  useEffect(() => {
    if (initialData?.piggeies) setFarms(initialData.piggeies);
  }, [initialData]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_API_BASE_URL}?token=${token}`,
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as { piggeies: Farm[] };
        console.log("WebSocket message received:", message);
        setFarms((prevFarms) => {
          return message.piggeies.map((incomingFarm) => {
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
          });
        });
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    ws.onclose = (event) =>
      console.log(`WebSocket disconnected: ${event.code}`);
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);

  return { farms, isLoading, isError };
}
