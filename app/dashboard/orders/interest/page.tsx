import InterestPage from "../../../../features/commerce/pages/InterestPage";
import { listings } from "../../../../features/commerce/data";
import type { OrderCartItem } from "../../../../features/commerce/data/orderCart";

function getCartItems(value: string | undefined): OrderCartItem[] {
  if (!value) return [];
  return value.split(",").flatMap((entry) => {
    const separator = entry.lastIndexOf(":");
    const code = separator === -1 ? entry : entry.slice(0, separator);
    const quantity = separator === -1 ? 1 : Math.max(1, Number(entry.slice(separator + 1)) || 1);
    const listing = listings.find((item) => item.code.toLowerCase() === code.toLowerCase());
    return listing ? [{ code: listing.code, name: listing.name, price: listing.price, quantity }] : [];
  });
}

export default async function InterestRoute({ searchParams }: { searchParams: Promise<{ listing?: string; cart?: string }> }) {
  const { listing: listingCode = "", cart } = await searchParams;
  const listing = listings.find((item) => item.code.toLowerCase() === listingCode.toLowerCase());
  const orderItems = getCartItems(cart);
  return <InterestPage listingCode={listing?.code || listingCode} listingName={listing?.name || ""} listingPrice={listing?.price || 0} orderItems={orderItems} />;
}
