import MarketPage from "../../../../../features/commerce/pages/MarketPage";

export default async function MarketplaceMarketPage({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  return <MarketPage slug={market} />;
}
