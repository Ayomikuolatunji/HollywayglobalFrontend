"use client";

import { useState } from "react";
import { getListingCategory, getListingImageUrl, type Listing } from "../data";

function ProductIllustration({ category }: { category: string }) {
  if (category.includes("Vehicles") || category.includes("machinery")) {
    return (
      <svg className="h-20 w-28" viewBox="0 0 112 80" aria-hidden="true">
        <path d="M20 49h72l-7-18a8 8 0 0 0-7-5H40a8 8 0 0 0-7 4l-9 19Z" fill="currentColor" opacity=".18" />
        <path d="M16 49h80v12a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5V49Zm16 17v5m48-5v5M34 49l8-16h34l7 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="31" cy="57" r="4" fill="currentColor" /><circle cx="81" cy="57" r="4" fill="currentColor" />
      </svg>
    );
  }

  if (category.includes("Furniture") || category.includes("interior")) {
    return (
      <svg className="h-20 w-28" viewBox="0 0 112 80" aria-hidden="true">
        <path d="M28 31a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v22H28V31Z" fill="currentColor" opacity=".16" />
        <path d="M28 51V31a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v20M21 43a7 7 0 0 1 7 7v12h56V50a7 7 0 1 1 14 0v18H14V50a7 7 0 0 1 7-7Zm3 25v5m64-5v5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (category.includes("Fashion") || category.includes("personal")) {
    return (
      <svg className="h-20 w-24" viewBox="0 0 96 80" aria-hidden="true">
        <path d="m35 20-20 12 9 15 10-5v31h29V42l10 5 9-15-20-12c-2 7-7 10-13 10s-12-3-14-10Z" fill="currentColor" opacity=".16" />
        <path d="m35 20-20 12 9 15 10-5v31h29V42l10 5 9-15-20-12c-2 7-7 10-13 10s-12-3-14-10Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }

  if (category.includes("Agro") || category.includes("craft")) {
    return (
      <svg className="h-20 w-24" viewBox="0 0 96 80" aria-hidden="true">
        <path d="M22 38h52l-7 34H29l-7-34Z" fill="currentColor" opacity=".16" />
        <path d="M22 38h52l-7 34H29l-7-34Zm12 0c0-12 6-21 14-21s14 9 14 21M38 51h20M35 61h26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className="h-20 w-24" viewBox="0 0 96 80" aria-hidden="true">
      <rect x="18" y="13" width="60" height="54" rx="6" fill="currentColor" opacity=".14" />
      <rect x="18" y="13" width="60" height="54" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M29 52 42 39l10 10 8-8 8 11M34 28h.1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MarketProductVisual({ listing }: { listing: Listing }) {
  const category = getListingCategory(listing);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br text-white ${listing.tone}`}>
      {!imageFailed && <img className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" src={getListingImageUrl(listing)} alt={listing.name} loading="lazy" onError={() => setImageFailed(true)} />}
      {imageFailed && <><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.22),transparent_32%)]" /><div className="relative drop-shadow-sm"><ProductIllustration category={category} /></div></>}
    </div>
  );
}
