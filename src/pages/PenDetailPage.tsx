import { useParams } from "react-router-dom";
import { usePenDetail } from "@/hooks/usePenDetail";
import { usePenRealtime } from "@/hooks/usePenRealtime";
import { ChevronLeft } from "lucide-react";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useMemo } from "react";
import RealtimeDataCard from "@/component/detail/RealtimeDataCard";
import ActivityChart from "@/component/detail/ActivityChart";
import ErrorScreen from "@/component/common/ErrorScreen";
import LoadingScreen from "@/component/common/LoadingScreen";
import type { PenDetailTimeSeriesPoint, PenRealtimeSample } from "@/types/pen";

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

  const baseChartData = useMemo<ChartEntry[]>(() => {
    if (!data?.time_series) return [];

    return data.time_series
      .map(
      (item: PenDetailTimeSeriesPoint, index: number): ChartEntry => ({
        index: index + 1,
        timestamp: `T-${data.time_series.length - index}`,
        activity: item.activity,
        feeding: item.feeding_time,
      }),
      )
      .slice(-10);
  }, [data]);

  const chartData = useMemo<ChartEntry[]>(() => {
    if (realtime.samples.length === 0) return baseChartData;

    const startIndex =
      baseChartData.length > 0
        ? baseChartData[baseChartData.length - 1].index + 1
        : 1;

    const realtimeEntries = realtime.samples.map(
      (sample: PenRealtimeSample, index): ChartEntry => ({
        index: startIndex + index,
        timestamp: sample.timestamp,
        activity: sample.activity,
        feeding: sample.feeding_time,
      }),
    );

    return [...baseChartData, ...realtimeEntries].slice(-10);
  }, [baseChartData, realtime.samples]);

  if (isLoading) {
    return <LoadingScreen />;
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
      {realtime.latest?.data && <RealtimeDataCard realtime={realtime.latest.data} />}

      {/* 활동 그래프 */}
      <ActivityChart chartData={chartData} />
    </div>
  );
}
