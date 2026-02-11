import PenCard from "./PenCard";

interface Farm {
  piggery_id: string;
  pens: any[];
}

interface Props {
  farm: Farm;
  openPenId: string | null;
  setOpenPenId: (id: string | null) => void;
}

export default function FarmSection({ farm, openPenId, setOpenPenId }: Props) {
  return (
    <section className="bg-[#F8F8F8] rounded-lg p-3 lg:p-6 min-h-[600px] flex flex-col">
      <div className="space-y-4">
        {farm.pens.map((pen) => (
          <PenCard
            key={pen.pen_id}
            pen={pen}
            isOpen={openPenId === pen.pen_id}
            onToggle={() =>
              setOpenPenId(openPenId === pen.pen_id ? null : pen.pen_id)
            }
          />
        ))}
      </div>
    </section>
  );
}
