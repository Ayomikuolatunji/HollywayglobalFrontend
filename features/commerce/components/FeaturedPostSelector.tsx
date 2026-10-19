"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { fetchPublicFeePolicy, type FeaturedPackageId } from "../../fees/data/publicFeesApi";

export type FeaturedPostPackage = FeaturedPackageId;

function money(amountMinor: number) {
  return `₦${(amountMinor / 100).toLocaleString("en-NG")}`;
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
  const [packages, setPackages] = useState<Awaited<ReturnType<typeof fetchPublicFeePolicy>>["featured_packages"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    void fetchPublicFeePolicy()
      .then((policy) => { if (active) setPackages(policy.featured_packages); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm" aria-labelledby="featured-post-title">
      <div>
        <span className="text-[10px] font-extrabold tracking-[.16em] text-[#ff8a00]">LISTING VISIBILITY OPTIONS</span>
        <h3 id="featured-post-title" className="mt-2 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Choose how this {contentType} should be reviewed</h3>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a]">Every {contentType} can be submitted at no extra charge. Optional visibility requests are priced by Hollyway and confirmed before anything is published.</p>
      </div>
      {loading && <p className="mt-4 rounded-lg border border-[#dfe4ed] bg-[#f8fafc] p-3 text-xs text-[#667085]">Loading current visibility options…</p>}
      {error && <p className="mt-4 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">Visibility options are temporarily unavailable. You can save this {contentType} as a Draft and try again later.</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {packages.map((item) => (
          <label className={`cursor-pointer rounded-lg border p-4 transition-colors ${value === item.id ? "border-[#1453bb] bg-[#f4f8ff]" : "border-[#dfe4ed] hover:border-[#9ebce8]"}`} key={item.id}>
            <span className="flex items-start gap-3">
              <input className="mt-1 accent-[#1453bb]" type="radio" name="featuredPostPackage" value={item.id} checked={value === item.id} onChange={onChange} />
              <span>
                <span className="block text-xs font-extrabold text-[#0b1830]">{item.name}</span>
                <strong className="mt-2 block font-[Manrope] text-xl font-extrabold text-[#1453bb]">{item.amount_minor ? money(item.amount_minor) : "Free"}</strong>
              </span>
            </span>
            <span className="mt-3 block text-[10px] leading-5 text-[#687895]">{item.description}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d]">Visibility amounts are optional requests, not listing fees. Admin approval and the official payment step are required before a featured placement is published. Until KYC and review are complete, this post remains a Draft.</p>
    </section>
  );
}
