import type { AbnormalPig } from "@/types/pen";
import { Activity, Clock4 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  pigs: AbnormalPig[];
}

export default function AbnormalPigList({ pigs }: Props) {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <p className="mb-4 text-gray-500 font-semibold">
        {t("dashboard.listofanomalies")} ({pigs.length}
        {t("dashboard.pigcount")})
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {pigs.map((pig) => (
          <div
            key={pig.wid}
            className="flex flex-row justify-between items-center border border-gray-200 rounded-lg p-2"
          >
            <div className="flex flex-row items-center gap-4">
              <img
                src={pig.thumbnail_url}
                alt="pig"
                className="w-16 h-16 object-cover rounded-md"
              />
              <p className="text-red-600 font-bold text-xl">{pig.wid}</p>
            </div>
            <div className="w-3/5 grid grid-cols-2 gap-2 font-semibold">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <Activity className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                <span>{pig.activity}m</span>
              </div>
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <Clock4 className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                <span>
                  {pig.feeding_time}
                  {t("dashboard.minutes")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
