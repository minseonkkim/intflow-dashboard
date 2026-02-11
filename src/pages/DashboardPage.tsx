import { useEffect, useState } from "react";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import FarmSelector from "@/component/dashboard/FarmSelector";
import { useRealtimeFarms } from "@/hooks/useRealtimeFarms";
import FarmSection from "@/component/dashboard/FarmSection";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { farms: realtimeFarms, isLoading, isError } = useRealtimeFarms();
  const [farms, setFarms] = useState(realtimeFarms ?? []);

  useEffect(() => {
    if (realtimeFarms) setFarms(realtimeFarms);
  }, [realtimeFarms]);
  const { t } = useTranslation();

  const [selectedFarmId, setSelectedFarmId] = useState("ALL");
  const [openPenId, setOpenPenId] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-white w-20 h-20" />
      </div>
    );

  if (isError) return <p className="p-6 text-red-500">에러 발생</p>;

  const filteredFarms =
    selectedFarmId === "ALL"
      ? farms
      : farms.filter((f) => f.piggery_id === selectedFarmId);

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6 flex flex-row justify-between items-center text-sm">
        <div className="w-40">
          <LanguageSwitcher />
        </div>
        <div className="text-white font-bold text-lg hidden lg:block">
          {t("dashboard.title")}
        </div>
        <div className="flex flex-row items-center">
          <FarmSelector
            farms={farms}
            selectedFarmId={selectedFarmId}
            onChange={setSelectedFarmId}
            allLabel={t("dashboard.allfarms")}
          />
          <button
            className="ml-2 p-2 border border-white text-white rounded-lg cursor-pointer hover:bg-white hover:text-[#062454] transition"
            onClick={logout}
          >
            {t("dashboard.logout")}
          </button>
        </div>
      </div>

      {filteredFarms.map((farm) => (
        <FarmSection
          key={farm.piggery_id}
          farm={farm}
          openPenId={openPenId}
          setOpenPenId={setOpenPenId}
        />
      ))}
    </div>
  );
}
