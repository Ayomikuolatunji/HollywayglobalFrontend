import { Suspense } from "react";
import UnifiedListingPage from "../../../../features/commerce/pages/UnifiedListingPage";

export default function NewListingPage() {
  return <Suspense fallback={null}><UnifiedListingPage /></Suspense>;
}
