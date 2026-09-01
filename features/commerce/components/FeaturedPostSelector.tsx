import type { ChangeEvent } from "react";

export type FeaturedPostPackage = "none" | "standard" | "priority";

export const featuredPostPackages: Array<{
  id: FeaturedPostPackage;
  name: string;
  amount: number;
  description: string;
}> = [
  { id: "none", name: "Standard listing", amount: 0, description: "Free. No extra charge. Your listing goes through the normal Admin review queue." },
  { id: "standard", name: "Featured listing", amount: 100, description: "Optional ₦100 visibility request for a featured position after Admin approval." },
  { id: "priority", name: "Priority featured listing", amount: 500, description: "Optional ₦500 visibility request for priority featured placement after Admin approval." },
];

export function getFeaturedPostPackage(id: string | null | undefined) {
  return featuredPostPackages.find((item) => item.id === id) ?? featuredPostPackages[0];
}

export default function FeaturedPostSelector({
  contentType,
  value,
  onChange,
}: {
  contentType: "listing" | "wanted request";
  value: FeaturedPostPackage;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm" aria-labelledby="featured-post-title">
      <div>
        <span className="text-[10px] font-extrabold tracking-[.16em] text-[#ff8a00]">LISTING VISIBILITY OPTIONS</span>
        <h3 id="featured-post-title" className="mt-2 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Choose how this {contentType} should be reviewed</h3>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a]">Every {contentType} can be submitted at no extra charge. The ₦100 and ₦500 options are optional visibility requests; Hollyway Admin confirms payment and placement before anything is published.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {featuredPostPackages.map((item) => (
          <label className={`cursor-pointer rounded-lg border p-4 transition-colors ${value === item.id ? "border-[#1453bb] bg-[#f4f8ff]" : "border-[#dfe4ed] hover:border-[#9ebce8]"}`} key={item.id}>
            <span className="flex items-start gap-3">
              <input className="mt-1 accent-[#1453bb]" type="radio" name="featuredPostPackage" value={item.id} checked={value === item.id} onChange={onChange} />
              <span>
                <span className="block text-xs font-extrabold text-[#0b1830]">{item.name}</span>
                <strong className="mt-2 block font-[Manrope] text-xl font-extrabold text-[#1453bb]">{item.amount ? `₦${item.amount.toLocaleString("en-NG")}` : "₦0 · Free"}</strong>
              </span>
            </span>
            <span className="mt-3 block text-[10px] leading-5 text-[#687895]">{item.description}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d]">The ₦100 and ₦500 amounts are optional visibility requests, not listing fees. Admin approval and the official payment step are required before a featured placement is published. Until KYC and review are complete, this post remains a Draft.</p>
    </section>
  );
}
