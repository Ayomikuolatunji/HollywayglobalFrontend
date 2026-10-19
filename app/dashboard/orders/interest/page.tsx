import InterestPage from "../../../../features/commerce/pages/InterestPage";

export default async function InterestRoute({ searchParams }: { searchParams: Promise<{ listing?: string; cart?: string }> }) {
  const { listing: listingCode = "" } = await searchParams;
  return <InterestPage listingCode={listingCode} />;
}
