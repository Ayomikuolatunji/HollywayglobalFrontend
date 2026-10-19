"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const routes = [
  ["A", "Day priority", "Tier 2 Mini Plus for a cold-drinks kiosk; Tier 4 Executive for commercial freezers and afternoon AC.", "day_priority"],
  ["B", "Night priority", "Tier 3 Home for overnight household circuits; Tier 5 Max for a full overnight 1.5HP inverter AC example.", "night_priority"],
  ["C", "Inverter sizing", "Tier 3 is the published 1HP pump starting point; Tier 4 and 5 cover larger pump or compressor starts.", "balanced_24_7"],
] as const;

export default function SolarDiscovery({ value, onChange }: Props) {
  return (
    <section className="border-y border-[#d6e3ef] bg-[#f5f9fc] py-10" aria-labelledby="solar-discovery-title">
      <div className="mx-auto w-[calc(100%-40px)] max-w-[1180px] lg:w-[calc(100%-64px)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black tracking-[.18em] text-[#2d83d5]">START WITH ABC</p>
            <h2 id="solar-discovery-title" className="mt-2 text-2xl font-black tracking-[-.05em] text-[#071a34]">Choose the problem your power system must solve.</h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-[#53627a]">These are starting points from the published guide. Hollyway confirms the final design after load and site assessment.</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {routes.map(([letter, title, text, focus]) => (
            <button
              className={`min-h-36 rounded-2xl border p-5 text-left transition ${value === focus ? "border-[#2d83d5] bg-[#071a34] text-white shadow-lg shadow-[#071a34]/10" : "border-[#d6e3ef] bg-white text-[#071a34] hover:border-[#7bb9ea]"}`}
              key={letter}
              type="button"
              onClick={() => onChange(focus)}
              aria-pressed={value === focus}
            >
              <span className={`text-[11px] font-black tracking-[.18em] ${value === focus ? "text-[#f4b41a]" : "text-[#2d83d5]"}`}>{letter}</span>
              <strong className="mt-3 block text-sm font-black">{title}</strong>
              <span className={`mt-2 block text-[11px] leading-5 ${value === focus ? "text-[#c6d8ea]" : "text-[#53627a]"}`}>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
