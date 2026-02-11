import { Activity, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RealtimeData {
  activity: number;
  feeding_time: number;
}

interface Props {
  realtime: RealtimeData;
}

export default function RealtimeDataCard({ realtime }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="grid grid-cols-2 gap-6 text-lg">
        <div className="flex flex-row items-center gap-2 lg:gap-4">
          <Activity className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
          <div className="flex flex-col gap-1">
            <p>{t("detail.activity")}</p>
            <p className="font-bold text-2xl text-[#8B5CF6]">
              {realtime.activity}m
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 lg:gap-4">
          <Thermometer className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
          <div className="flex flex-col gap-1">
            <p>{t("detail.feeding")}</p>
            <p className="font-bold text-2xl text-[#F97316]">
              {realtime.feeding_time}
              {t("detail.minutes")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
