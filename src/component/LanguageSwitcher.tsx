import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import koFlag from "@/assets/flags/ko.png";
import usFlag from "@/assets/flags/us.jpg";
import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = i18nInstance.language;

  const changeLanguage = (lang: "ko" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  const languages = [
    { code: "ko", label: "한국어", flag: koFlag },
    { code: "en", label: "English", flag: usFlag },
  ];

  const current = languages.find((l) => l.code === currentLang);

  return (
    <div className="text-sm relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-white cursor-pointer"
      >
        <img
          src={current?.flag}
          alt="flag"
          className="w-5 h-5 rounded-full object-cover"
        />
        <span>{current?.label}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-30 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code as "ko" | "en")}
              className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 ${
                currentLang === lang.code ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <img
                src={lang.flag}
                alt="flag"
                className="w-5 h-5 rounded-full object-cover"
              />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
