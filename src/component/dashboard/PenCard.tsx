import {
  ChevronDown,
  ChevronRight,
  PiggyBank,
  Activity,
  Clock4,
  Thermometer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AbnormalPigList from "./AbnormalPigList";
import { useTranslation } from "react-i18next";
import type { Pen } from "@/types/pen";

interface Props {
  pen: Pen;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PenCard({ pen, isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      onClick={onToggle}
      className="bg-white border border-gray-200 rounded-lg cursor-pointer"
    >
      <div className="flex flex-row items-start lg:items-center p-4">
        <span className="lg:ml-2 lg:mr-6 mr-2 mt-1 lg:mt-0">
          {isOpen ? (
            <ChevronDown size={22} />
          ) : (
            <ChevronRight size={22} className="text-gray-400" />
          )}
        </span>
        <div className="flex flex-col lg:flex-row justify-between w-full gap-4 lg:gap-30">
          {/* Pen 정보 */}
          <div className="flex flex-row gap-2 items-center">
            <span className="font-bold text-lg">{pen.pen_name}</span>
            <span className="text-white bg-red-600 px-3 py-1.5 rounded-full text-sm">
              {pen.abnormal_pigs.length}
              {t("dashboard.pigcount")}
            </span>
          </div>

          {/* 상태 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <PiggyBank className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <span>{t("dashboard.inventory")}</span>
                <span className="font-semibold truncate">
                  {pen.current_pig_count}
                  {t("dashboard.pigcount")}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <Activity className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <span>{t("dashboard.vitality")}</span>
                <span className="font-semibold truncate">
                  {pen.avg_activity_level}m
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <Clock4 className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <span>{t("dashboard.mealtime")}</span>
                <span className="font-semibold truncate">
                  {pen.avg_feeding_time_minutes}
                  {t("dashboard.minutes")}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <Thermometer className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
              <div className="flex flex-col gap-1">
                <span>{t("dashboard.tempature")}</span>
                <span className="font-semibold truncate">
                  {pen.avg_temperature_celsius}℃
                </span>
              </div>
            </div>
          </div>

          <div
            className="text-[#062454] font-semibold underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pen/${pen.pen_id}`);
            }}
          >
            {t("dashboard.detail")}
          </div>
        </div>
      </div>

      {/* 비정상 돼지 리스트 */}
      {isOpen && pen.abnormal_pigs.length > 0 && (
        <AbnormalPigList pigs={pen.abnormal_pigs} />
      )}
    </div>
  );
}
