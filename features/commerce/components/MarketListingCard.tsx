import Link from "next/link";
import AddToOrderButton from "./AddToOrderButton";
import MarketProductVisual from "./MarketProductVisual";
import SaveListingButton from "./SaveListingButton";
import { getListingCategory, getListingMarket, getMarketDisplayName, type Listing } from "../data";

function shortMarketName(market: string) { return getMarketDisplayName(market).replace(/ Market$/, ""); }

function visualAspect(code: string) {
  const value = code.split("").reduce((total, character) => total + character.charCodeAt(0), 0) % 3;
  const baseAspect = value === 0 ? "aspect-[4/5]" : value === 1 ? "aspect-square" : "aspect-[4/3]";
  return `${baseAspect} max-[379px]:aspect-[16/9]`;
}

export default function MarketListingCard({ listing, detailsHref }: { listing: Listing; detailsHref: string }) {
  const market = getListingMarket(listing);
  const category = getListingCategory(listing);
  const ownListing = listing.isOwnedByRequester === true;

  return (
    <article className="group mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-[#e4e2da] bg-white shadow-[0_1px_2px_rgba(18,20,28,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(18,20,28,.09)]">
      <div className="relative">
        <Link className="block" href={detailsHref} aria-label={`View ${listing.name}`}>
          <MarketProductVisual listing={listing} aspectClass={visualAspect(listing.code)} />
        </Link>
        <span className="absolute left-2.5 top-2.5 max-w-[75%] truncate rounded-full bg-[#12141c]/65 px-2.5 py-1 text-[9px] font-extrabold text-white backdrop-blur-sm">{shortMarketName(market)}</span>
        <span className="absolute right-2.5 top-2.5"><SaveListingButton code={listing.code} name={listing.name} /></span>
        {listing.featured && <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#b8560d] px-2.5 py-1 text-[9px] font-extrabold text-white">Featured</span>}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold text-[#7a5c00]">{category}</p>
            <Link className="mt-1 block" href={detailsHref}>
              <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#12141c] group-hover:text-[#b8560d]">{listing.name}</h3>
            </Link>
          </div>
          <strong className="shrink-0 font-[Manrope] text-sm font-extrabold text-[#12141c]">₦{listing.price.toLocaleString("en-NG")}</strong>
        </div>
        <p className="mt-2 line-clamp-1 text-[10px] text-[#5c5f6b]">{listing.location || "Location to be confirmed"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-[#7b7d86]">
          <span className="rounded-full bg-[#edeff5] px-2 py-0.5 font-bold text-[#14213d]">{listing.condition}</span>
          <span>{listing.date}</span>
          <span>{listing.views} views</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#ece9e2] pt-3">
          <Link className="text-[10px] font-extrabold text-[#1453bb] hover:underline" href={detailsHref}>View listing</Link>
          {ownListing ? <span className="inline-flex h-8 items-center rounded-md bg-[#f5f4f0] px-2 text-[9px] font-bold text-[#5c5f6b]" title="You cannot order your own listing">Your listing</span> : <AddToOrderButton item={{ code: listing.code, name: listing.name, price: listing.price }} disabled={listing.quantity !== undefined && listing.quantity < 1} />}
        </div>
        <p className="mt-2 truncate text-[9px] font-semibold text-[#9498a3]" title={listing.code}>{listing.code}</p>
      </div>
    </article>
  );
}
