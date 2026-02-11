import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Farm {
  piggery_id: string;
  piggery_name: string;
}

interface Props {
  farms: Farm[];
  selectedFarmId: string;
  onChange: (id: string) => void;
  allLabel: string;
}

export default function FarmSelector({
  farms,
  selectedFarmId,
  onChange,
  allLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected =
    selectedFarmId === "ALL"
      ? { piggery_name: allLabel }
      : farms.find((f) => f.piggery_id === selectedFarmId);

  return (
    <div ref={wrapperRef} className="relative text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-40 px-4 py-2 text-white border border-white rounded-lg cursor-pointer hover:bg-white hover:text-[#062454] transition"
      >
        <span>{selected?.piggery_name}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              onChange("ALL");
              setOpen(false);
            }}
            className={`cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 ${
              selectedFarmId === "ALL" ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            {allLabel}
          </button>

          {farms.map((farm) => (
            <button
              key={farm.piggery_id}
              onClick={() => {
                onChange(farm.piggery_id);
                setOpen(false);
              }}
              className={`cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 ${
                selectedFarmId === farm.piggery_id
                  ? "bg-gray-100 font-semibold"
                  : ""
              }`}
            >
              {farm.piggery_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
