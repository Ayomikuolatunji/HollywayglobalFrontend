import InterestPage from "../../../../features/commerce/pages/InterestPage";
import { listings } from "../../../../features/commerce/data";

export default async function InterestRoute({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing: listingCode = "" } = await searchParams;
  const listing = listings.find((item) => item.code.toLowerCase() === listingCode.toLowerCase());
  return <InterestPage listingCode={listing?.code || listingCode} listingName={listing?.name || ""} />;
}
