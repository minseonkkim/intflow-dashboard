import type { PensResponse } from "@/types/pen";
import api from "./axios";

export const fetchPens = async (): Promise<PensResponse> => {
  const res = await api.get<PensResponse>("/pens");

  if (!res.data || !Array.isArray(res.data.piggeies)) {
    throw new Error("Invalid pens response");
  }
  console.log(res.data);
  return res.data;
};
