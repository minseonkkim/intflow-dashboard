import { useParams } from "react-router-dom";
import { usePenDetail } from "@/hooks/usePenDetail";
import { usePenRealtime } from "@/hooks/usePenRealtime";
import { ChevronLeft, Loader2 } from "lucide-react";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useEffect, useState } from "react";
import RealtimeDataCard from "@/component/detail/RealtimeDataCard";
import ActivityChart from "@/component/detail/ActivityChart";

type ChartEntry = {
  index: number;
  timestamp: string;
  activity: number;
  feeding: number;
};

export default function PenDetailPage() {
  const { penId } = useParams();
  const numericId = Number(penId?.replace("room_", ""));

  const { data, isLoading, isError } = usePenDetail(numericId);
  const realtime = usePenRealtime(numericId);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-white w-20 h-20" />
      </div>
    );

  if (isError) return <p>에러 발생</p>;

  // 그래프용 데이터 가공
  const [chartData, setChartData] = useState<ChartEntry[]>(
    (data?.time_series ?? []).map((item: any, index: number) => ({
      index: index + 1,
      timestamp: `T-${10 - index}`,
      activity: item.activity,
      feeding: item.feeding_time,
    })),
  );

  useEffect(() => {
    if (realtime) {
      setChartData((prev: ChartEntry[]) => {
        const newEntry: ChartEntry = {
          index: prev.length + 1,
          timestamp: new Date().toLocaleTimeString(),
          activity: realtime.data.activity,
          feeding: realtime.data.feeding_time,
        };
        const updated = [...prev, newEntry];
        return updated.slice(-10); // 최근 10개만 유지
      });
    }
  }, [realtime]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <LanguageSwitcher />
        <div className="flex flex-row items-center gap-2">
          <ChevronLeft
            size={24}
            className="text-white cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-lg font-bold text-white">{data.name}</h1>
        </div>
        <div></div>
      </div>
      {/* 실시간 데이터 카드 */}
      {realtime && <RealtimeDataCard realtime={realtime.data} />}
      {/* 활동량 그래프 */}
      <ActivityChart chartData={chartData} />
    </div>
  );
}
