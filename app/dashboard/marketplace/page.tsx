import { Suspense } from "react";
import MarketplacePage from "../../../features/commerce/pages/MarketplacePage";

export default function MarketplaceRoute() {
  return (
    <Suspense fallback={null}>
      <MarketplacePage />
    </Suspense>
  );
}
