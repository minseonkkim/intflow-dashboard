import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const login = async ({
  username,
  password,
}: LoginParams): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};
