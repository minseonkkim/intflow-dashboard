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

export default function DashboardPage() {
  const { data, isLoading, isError } = usePens();

  const [selectedFarmId, setSelectedFarmId] = useState("ALL");
  const [openPenId, setOpenPenId] = useState<string | null>(null);

  if (isLoading) return <p className="p-6">로딩 중...</p>;
  if (isError) return <p className="p-6 text-red-500">에러 발생</p>;

  const farms = data?.piggeies ?? [];

  const filteredFarms =
    selectedFarmId === "ALL"
      ? farms
      : farms.filter((f) => f.piggery_id === selectedFarmId);

  return (
    <div className="p-6 min-h-screen bg-[#062454]">
      <div className="mb-6 flex flex-row justify-between items-center text-sm">
        <div></div>
        <div className="text-white font-bold text-lg">Inflow Test</div>
        <div>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white text-white focus:outline-none"
          >
            <option value="ALL">전체 농장</option>
            {farms.map((farm) => (
              <option key={farm.piggery_id} value={farm.piggery_id}>
                {farm.piggery_name}
              </option>
            ))}
          </select>
          <button className="ml-2 p-2 border border-white text-white rounded-lg">
            로그아웃
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
                          {pen.abnormal_pigs.length}두
                        </span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div className="flex flex-row items-center gap-2 lg:gap-4">
                          <PiggyBank className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                          <div className="flex flex-col gap-1">
                            <span>재고</span>
                            <span className="font-semibold truncate">
                              {pen.current_pig_count}두
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 lg:gap-4">
                          <Activity className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                          <div className="flex flex-col gap-1">
                            <span>활력도</span>
                            <span className="font-semibold truncate">
                              {pen.avg_activity_level}m
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 lg:gap-4">
                          <Clock4 className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                          <div className="flex flex-col gap-1">
                            <span>식사 시간</span>
                            <span className="font-semibold truncate">
                              {pen.avg_feeding_time_minutes}분
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 lg:gap-4">
                          <Thermometer className="w-10 h-10 shrink-0 bg-[#F6FAFF] text-[#062454] rounded-full p-2" />
                          <div className="flex flex-col gap-1">
                            <span>온도</span>
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
                          이상 개체 목록 ({pen.abnormal_pigs.length}구)
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
                                  <span>{pig.feeding_time}분</span>
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
