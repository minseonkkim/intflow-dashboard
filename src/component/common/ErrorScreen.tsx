import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";

export default function ErrorScreen() {
  const { t } = useTranslation();

  return (
    <div className="p-6 min-h-screen flex flex-col">
      <LanguageSwitcher />

      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
        <AlertCircle className="w-14 h-14 text-red-400" />
        <p className="text-lg text-white">{t("error.error")}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-[#062454] rounded-lg cursor-pointer hover:bg-gray-100 transition"
        >
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
