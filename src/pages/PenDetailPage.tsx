import { useParams } from "react-router-dom";
import { usePenDetail } from "@/hooks/usePenDetail";
import { usePenRealtime } from "@/hooks/usePenRealtime";
import { Activity, ChevronLeft, Loader2, Thermometer } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
      {realtime && (
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <Activity className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <p>{t("detail.activity")}</p>
                <p className="font-bold text-2xl text-[#8B5CF6]">
                  {realtime.data.activity}m
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <Thermometer className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <p>{t("detail.feeding")}</p>
                <p className="font-bold text-2xl text-[#F97316]">
                  {realtime.data.feeding_time}
                  {t("detail.minutes")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 활동량 그래프 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="h-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />

              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="activity"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={false}
              />

              <Line
                type="monotone"
                dataKey="feeding"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
