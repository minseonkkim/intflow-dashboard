import { useParams } from "react-router-dom";
import { usePenDetail } from "@/hooks/usePenDetail";
import { usePenRealtime } from "@/hooks/usePenRealtime";
import { ChevronLeft } from "lucide-react";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useEffect, useState } from "react";
import RealtimeDataCard from "@/component/detail/RealtimeDataCard";
import ActivityChart from "@/component/detail/ActivityChart";
import ErrorScreen from "@/component/common/ErrorScreen";
import LoadingScrean from "@/component/common/LoadingScrean";

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

  const [chartData, setChartData] = useState<ChartEntry[]>([]);

  useEffect(() => {
    if (!data?.time_series) return;

    const formatted = data.time_series.map(
      (item: any, index: number): ChartEntry => ({
        index: index + 1,
        timestamp: `T-${data.time_series.length - index}`,
        activity: item.activity,
        feeding: item.feeding_time,
      }),
    );

    setChartData(formatted.slice(-10));
  }, [data]);

  useEffect(() => {
    if (!realtime?.data) return;

    setChartData((prev) => {
      const newEntry: ChartEntry = {
        index: prev.length > 0 ? prev[prev.length - 1].index + 1 : 1,
        timestamp: new Date().toLocaleTimeString("en-GB"),
        activity: realtime.data.activity,
        feeding: realtime.data.feeding_time,
      };

      return [...prev, newEntry].slice(-10);
    });
  }, [realtime]);

  if (isLoading) {
    return <LoadingScrean />;
  }

  if (isError || !data) {
    return <ErrorScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 상단 헤더 */}
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

        <div />
      </div>

      {/* 실시간 카드 */}
      {realtime?.data && <RealtimeDataCard realtime={realtime.data} />}

      {/* 활동 그래프 */}
      <ActivityChart chartData={chartData} />
    </div>
  );
}
