import ListingDetailsPage from "../../../../features/commerce/pages/ListingDetailsPage";

export default async function MarketplaceListingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ListingDetailsPage code={code} />;
}
