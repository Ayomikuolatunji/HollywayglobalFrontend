import type { ChangeEvent } from "react";

export type FeaturedPostPackage = "none" | "standard" | "priority";

export const featuredPostPackages: Array<{
  id: FeaturedPostPackage;
  name: string;
  amount: number;
  description: string;
}> = [
  { id: "none", name: "No promotion", amount: 0, description: "Keep this post in the standard review queue." },
  { id: "standard", name: "Standard feature", amount: 100, description: "Add a paid feature request to the post." },
  { id: "priority", name: "Priority feature", amount: 500, description: "Request the highest available feature level." },
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
        <span className="text-[10px] font-extrabold tracking-[.16em] text-[#ff8a00]">OPTIONAL PAID ADD-ON</span>
        <h3 id="featured-post-title" className="mt-2 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Feature your {contentType}</h3>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a]">Choose whether Hollyway should consider this {contentType} for featured placement after Admin review.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {featuredPostPackages.map((item) => (
          <label className={`cursor-pointer rounded-lg border p-4 transition-colors ${value === item.id ? "border-[#1453bb] bg-[#f4f8ff]" : "border-[#dfe4ed] hover:border-[#9ebce8]"}`} key={item.id}>
            <span className="flex items-start gap-3">
              <input className="mt-1 accent-[#1453bb]" type="radio" name="featuredPostPackage" value={item.id} checked={value === item.id} onChange={onChange} />
              <span>
                <span className="block text-xs font-extrabold text-[#0b1830]">{item.name}</span>
                <strong className="mt-2 block font-[Manrope] text-xl font-extrabold text-[#1453bb]">{item.amount ? `₦${item.amount.toLocaleString("en-NG")}` : "Free"}</strong>
              </span>
            </span>
            <span className="mt-3 block text-[10px] leading-5 text-[#687895]">{item.description}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d]">The feature amount is an additional post-promotion fee. Your post remains a Draft until the account requirements, payment step and Admin approval are completed.</p>
    </section>
  );
}
