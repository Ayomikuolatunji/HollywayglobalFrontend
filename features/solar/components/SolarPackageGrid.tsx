import type { SolarPackage } from "../data/solarApi";

type Props = { packages: SolarPackage[]; onChoose: (packageKey: string) => void };

export default function SolarPackageGrid({ packages, onChoose }: Props) {
  return (
    <section className="mx-auto w-[calc(100%-40px)] max-w-[1180px] py-14 lg:w-[calc(100%-64px)] lg:py-20" id="packages">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black tracking-[.18em] text-[#2d83d5]">PUBLISHED SYSTEMS</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-.06em] text-[#071a34]">A system for the load you actually have.</h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-[#53627a]">Prices and equipment combinations are customer-facing examples from the supplied specification. Confirm exact hardware, installation scope and final price before order.</p>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {packages.map((item) => (
          <article className="flex min-h-[310px] flex-col border border-[#d6e3ef] bg-white p-5 shadow-[0_10px_30px_rgba(7,26,52,.05)]" key={item.package_key}>
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-black tracking-[.16em] text-[#2d83d5]">{item.tier_label}</span><span className="h-2 w-2 rounded-full bg-[#f4b41a]" /></div>
            <h3 className="mt-4 text-base font-black leading-tight text-[#071a34]">{item.name}</h3>
            <p className="mt-2 min-h-10 text-[11px] leading-5 text-[#53627a]">{item.summary}</p>
            <p className="mt-4 text-lg font-black text-[#071a34]">{item.price_label}</p>
            <div className="mt-4 space-y-2 border-t border-[#edf2f6] pt-4 text-[10px] leading-4 text-[#53627a]">
              <p><strong className="text-[#071a34]">Inverter:</strong> {item.inverter}</p>
              <p><strong className="text-[#071a34]">Battery:</strong> {item.battery}</p>
              <p><strong className="text-[#071a34]">Panels:</strong> {item.panels}</p>
            </div>
            <details className="mt-3 border-t border-[#edf2f6] pt-3 text-[10px] text-[#53627a]">
              <summary className="cursor-pointer font-black text-[#145b9c]">See package notes</summary>
              <div className="mt-3 space-y-2 leading-4">
                <p><strong className="text-[#071a34]">Best for:</strong> {item.best_for.join(" · ")}</p>
                <p><strong className="text-[#071a34]">Included:</strong> {item.included_items.join(" · ")}</p>
                {item.load_notes.map((note) => <p key={note}>• {note}</p>)}
                {item.warranty_notes.map((note) => <p key={note}>• {note}</p>)}
              </div>
            </details>
            <button className="mt-auto inline-flex h-9 items-center justify-center border border-[#2d83d5] text-[10px] font-black text-[#145b9c] hover:bg-[#edf7ff]" type="button" onClick={() => onChoose(item.package_key)}>Use this as a starting point</button>
          </article>
        ))}
      </div>
    </section>
  );
}
