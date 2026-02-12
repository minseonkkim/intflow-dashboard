import { Loader2 } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function LoadingScrean() {
  const { t } = useTranslation();

  return (
    <div className="p-6 min-h-screen flex flex-col">
      <LanguageSwitcher />
      <div className="flex flex-col justify-center items-center flex-1 space-y-4">
        <Loader2 className="animate-spin text-white w-20 h-20" />
        <p className="text-white text-lg font-medium">{t("common.loading")}</p>
      </div>
    </div>
  );
}
