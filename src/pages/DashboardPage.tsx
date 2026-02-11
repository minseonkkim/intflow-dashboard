import { useState } from "react";
import { usePens } from "@/hooks/usePens";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Clock4,
  PiggyBank,
  Thermometer,
} from "lucide-react";
import LanguageSwitcher from "@/component/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { data, isLoading, isError } = usePens();

  const { t } = useTranslation();

  const [selectedFarmId, setSelectedFarmId] = useState("ALL");
  const [openPenId, setOpenPenId] = useState<string | null>(null);

  if (isLoading) return <p className="p-6">로딩 중...</p>;
  if (isError) return <p className="p-6 text-red-500">에러 발생</p>;

  const farms = data?.piggeies ?? [];

  const filteredFarms =
    selectedFarmId === "ALL"
      ? farms
      : farms.filter((f) => f.piggery_id === selectedFarmId);

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 min-h-screen bg-[#062454]">
      <div className="mb-6 flex flex-row justify-between items-center text-sm">
        <div className="w-40">
          <LanguageSwitcher />
        </div>
        <div className="text-white font-bold text-lg hidden lg:block">
          {t("dashboard.title")}
        </div>
        <div>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
          >
            <option value="ALL">{t("dashboard.allfarms")}</option>
            {farms.map((farm) => (
              <option key={farm.piggery_id} value={farm.piggery_id}>
                {farm.piggery_name}
              </option>
            ))}
          </select>
          <button
            className="ml-2 p-2 border border-white text-white rounded-lg cursor-pointer hover:bg-white hover:text-[#062454] transition"
            onClick={logout}
          >
            {t("dashboard.logout")}
          </button>
        </div>
      </div>

      {filteredFarms.map((farm) => (
        <section key={farm.piggery_id} className="bg-[#F8F8F8] rounded-lg p-6">
          <div className="space-y-4">
            {farm.pens.map((pen) => {
              const isOpen = openPenId === pen.pen_id;

              return (
                <div
                  key={pen.pen_id}
                  onClick={() => setOpenPenId(isOpen ? null : pen.pen_id)}
                  className="bg-white border border-gray-200 rounded-lg cursor-pointer"
                >
                  <div className="flex flex-row items-center p-4">
                    <span className="lg:ml-2 lg:mr-6 mr-2">
                      {isOpen ? (
                        <ChevronDown size={22} />
                      ) : (
                        <ChevronRight size={22} className="text-gray-400" />
                      )}
                    </span>
                    <div className="flex flex-col lg:flex-row justify-between w-full gap-4 lg:gap-30">
                      <div className="flex flex-row gap-2 items-center">
                        <span className="font-bold text-lg">
                          {pen.pen_name}
                        </span>
                        <span className="text-white bg-red-600 px-3 py-1.5 rounded-full text-sm">
                          {pen.abnormal_pigs.length}
                          {t("dashboard.pigcount")}
                        </span>
                      </div>
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
                    </div>
                  </div>
                  {isOpen && pen.abnormal_pigs.length > 0 && (
                    <>
                      <hr className="border-gray-200" />
                      <div className="p-6">
                        <p className="mb-4 text-gray-500 font-semibold">
                          {t("dashboard.listofanomalies")} (
                          {pen.abnormal_pigs.length}
                          {t("dashboard.pigcount")})
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {pen.abnormal_pigs.map((pig) => (
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
                                <p className="text-red-600 font-bold text-xl">
                                  {pig.wid}
                                </p>
                              </div>
                              <div className="w-3/5 flex flex-row justify-between font-semibold">
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
                                <p></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
