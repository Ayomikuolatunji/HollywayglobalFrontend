"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import SocialPublishRequestButton from "../components/SocialPublishRequestButton";
import WalletPromotionPaymentButton from "../components/WalletPromotionPaymentButton";
import { fetchListing, formatListingMoney, listingMediaUrl, type Listing } from "../data/listingApi";

export default function CustomerListingDetailsPage({ reference }: { reference: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setListing(null);
    setError("");
    fetchListing(reference)
      .then((result) => {
        if (active) setListing(result);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof ApiResponseError ? reason.message : "The listing could not be loaded.");
        }
      });
    return () => {
      active = false;
    };
  }, [reference]);

  if (error) return <ListingError message={error} />;
  if (!listing) return <p className="p-6 text-xs font-semibold text-[#7d899d]">Loading listing…</p>;

  const location = [listing.area, listing.city, listing.state].filter(Boolean).join(", ");
  const editable = listing.status === "draft" || listing.status === "rejected";

  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      <CommercePageHeader
        compact
        kicker="LISTING DETAILS"
        title={listing.item_name || "Untitled listing"}
        description={`${listing.reference} · ${listing.status_label}`}
        action={<BackToListings />}
      />
      <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <ListingOverview listing={listing} location={location} />
        <ListingMedia listing={listing} setListing={setListing} editable={editable} />
      </section>
    </div>
  );
}

function ListingError({ message }: { message: string }) {
  return (
    <div className="p-6">
      <p className="rounded-lg border border-[#f3c4c4] bg-[#fff5f5] p-4 text-xs font-semibold text-[#a32929]">{message}</p>
      <Link className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/listings">
        Back to my listings <Arrow />
      </Link>
    </div>
  );
}

function BackToListings() {
  return <Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/listings">Back to my listings <Arrow /></Link>;
}

function ListingOverview({ listing, location }: { listing: Listing; location: string }) {
  const details: Array<[string, string]> = [
    ["Selling route", listing.selling_route],
    ["Location", location],
    ["Condition", listing.condition],
    ["Quantity", `${listing.quantity}${listing.unit ? ` ${listing.unit}` : ""}`],
    ["Selling price", formatListingMoney(listing.unit_price_minor)],
    ["Bulk price", formatListingMoney(listing.bulk_price_minor)],
    ["Brand", listing.brand || "Not provided"],
    ["Model or specifications", listing.model_specifications || "Not provided"],
  ];

  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">{listing.reference}</span>
          <h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{listing.category || "Category not selected"}</h2>
        </div>
        <span className="rounded-full bg-[#f4f8ff] px-3 py-2 text-[10px] font-extrabold text-[#1453bb]">{listing.status_label}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#53627a]">{listing.description || "No description added yet."}</p>
      <dl className="mt-5 grid gap-3 border-t border-[#eef1f4] pt-4 sm:grid-cols-2">
        {details.map(([label, value]) => <DetailValue key={label} label={label} value={value} />)}
      </dl>
      {listing.additional_items.length > 0 && (
        <div className="mt-5 border-t border-[#eef1f4] pt-4">
          <h3 className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8995a8]">Additional items in this submission</h3>
          <div className="mt-2 divide-y divide-[#eef1f4]">
            {listing.additional_items.map((item) => (
              <div className="flex items-center justify-between gap-3 py-2 text-xs" key={item.id}>
                <span><strong className="font-extrabold text-[#0b1830]">{item.item_name}</strong><small className="ml-2 text-[#687895]">{item.category} · ×{item.quantity}</small></span>
                <span className="shrink-0 font-bold text-[#31425e]">{formatListingMoney(item.unit_price_minor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DetailValue({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8995a8]">{label}</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{value}</dd></div>;
}

function ListingMedia({ listing, setListing, editable }: {
  listing: Listing;
  setListing: (value: Listing) => void;
  editable: boolean;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Media</h2>
      {listing.media.length ? <MediaGrid listing={listing} /> : <p className="text-xs leading-5 text-[#7d899d]">No media has been added to this Draft yet.</p>}
      <WalletPromotionPaymentButton
        targetType="listing"
        reference={listing.reference}
        packageId={listing.visibility_package}
        paymentStatus={listing.featured_payment_status}
        onPaid={() => setListing({ ...listing, featured_payment_status: "paid" })}
      />
      <SocialPublishRequestButton reference={listing.reference} listingName={listing.item_name || "this listing"} listingStatus={listing.status} />
      <NextStep listing={listing} editable={editable} />
    </section>
  );
}

function MediaGrid({ listing }: { listing: Listing }) {
  return (
    <div className="grid gap-3">
      {listing.media.map((media) => media.kind === "photo" ? (
        <img className="max-h-64 w-full rounded-lg object-cover" key={media.id} src={listingMediaUrl(media)} alt={listing.item_name || "Listing product"} />
      ) : <video className="w-full rounded-lg bg-[#0b1830]" controls key={media.id} src={listingMediaUrl(media)} />)}
    </div>
  );
}

function NextStep({ listing, editable }: { listing: Listing; editable: boolean }) {
  return (
    <div className="border-t border-[#eef1f4] pt-4">
      <h3 className="text-[10px] font-extrabold tracking-[.14em] text-[#8995a8]">NEXT STEP</h3>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">
        {listing.status === "draft" ? "Continue the listing form when the details and media are ready." : "Hollyway will update this listing after review."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {editable && <Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white" href={`/dashboard/listings/new?reference=${encodeURIComponent(listing.reference)}`}>Continue listing <Arrow /></Link>}
        <Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-[10px] font-extrabold text-[#1453bb]" href="/dashboard/listings/new">Create another listing <Arrow /></Link>
      </div>
    </div>
  );
}
