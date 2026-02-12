import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access_token);
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 401) {
        setErrorKey("login.invalidCredentials");
      } else if (status === 422) {
        setErrorKey("login.invalidRequest");
      } else {
        setErrorKey("login.serverError");
      }
    },
  });

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorKey("login.requiredFields");
      return;
    }
    setErrorKey(null);
    mutate({ username: trimmedUsername, password: trimmedPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#062454] mb-6">
          {t("login.title")}
        </h1>

        <div className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("login.id")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062454]"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.password")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062454]"
          />

          {errorKey && (
            <p className="text-red-500 text-xs text-center">{t(errorKey)}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-[#062454] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? t("login.loggingIn") : t("login.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
