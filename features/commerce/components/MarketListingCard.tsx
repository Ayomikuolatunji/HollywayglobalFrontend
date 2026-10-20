import Link from "next/link";
import AddToOrderButton from "./AddToOrderButton";
import MarketProductVisual from "./MarketProductVisual";
import SaveListingButton from "./SaveListingButton";
import { getListingMarket, getMarketDisplayName, type Listing } from "../data";

const marketAccent: Record<string, string> = {
  "Urgent Sale Market": "border-t-[#b8560d]",
  "Relocation / Japa Market": "border-t-[#1f7a5c]",
  "Importer / Container Market": "border-t-[#3b4b6b]",
  "Campus & NYSC Market": "border-t-[#7a5c00]",
  "Business Clearance Market": "border-t-[#6b2545]",
};

function shortMarketName(market: string) { return getMarketDisplayName(market).replace(/ Market$/, ""); }

export default function MarketListingCard({ listing, detailsHref }: { listing: Listing; detailsHref: string }) {
  const market = getListingMarket(listing);
  const accent = marketAccent[market] || "border-t-[#14213d]";

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-[14px] border border-t-[3px] border-[#e4e2da] bg-white shadow-[0_1px_2px_rgba(18,20,28,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(18,20,28,.09)] ${accent}`}>
      <div className="relative">
        <Link className="block" href={detailsHref} aria-label={`View ${listing.name}`}><MarketProductVisual listing={listing} /></Link>
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#12141c]/60 px-2.5 py-1 text-[9px] font-extrabold text-white backdrop-blur-sm">{shortMarketName(market)}</span>
        <span className="absolute right-2.5 top-2.5"><SaveListingButton code={listing.code} name={listing.name} /></span>
        {listing.featured && <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#b8560d] px-2.5 py-1 text-[9px] font-extrabold text-white">Featured</span>}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <strong className="font-[Manrope] text-base font-extrabold text-[#12141c]">₦{listing.price.toLocaleString("en-NG")}</strong>
        <Link className="mt-1 block" href={detailsHref}><h3 className="line-clamp-1 text-xs font-semibold text-[#12141c] group-hover:text-[#b8560d]">{listing.name}</h3></Link>
        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#5c5f6b]"><span className="truncate">{listing.location}</span><span className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#9498a3]" /><span className="shrink-0">{listing.code}</span></p>
        <div className="mt-2 flex items-center justify-between border-t border-[#e4e2da] pt-2"><span className="rounded-full bg-[#edeff5] px-2 py-0.5 text-[9px] font-bold text-[#14213d]">{listing.condition}</span><span className="text-[9px] text-[#9498a3]">{listing.date}</span></div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-[#e4e2da] pt-3">
          <Link className="inline-flex h-8 items-center justify-center rounded-md border border-[#dfe4ed] px-2.5 text-[9px] font-extrabold text-[#1453bb] hover:border-[#1453bb]" href={detailsHref}>View listing</Link>
          <AddToOrderButton item={{ code: listing.code, name: listing.name, price: listing.price }} />
        </div>
      </div>
    </article>
  );
}
