import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access_token);
      console.log("로그인 성공");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("로그인 실패", error);
    },
  });

  const handleLogin = () => {
    if (!username || !password) return;
    mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#062454]">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#062454] mb-6">
          Smart Farm Login
        </h1>

        <div className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062454]"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062454]"
          />

          <button
            onClick={handleLogin}
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-[#062454] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
