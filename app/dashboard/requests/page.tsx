import { Suspense } from "react";
import MyRequestsPage from "../../../features/commerce/pages/MyRequestsPage";

export default function RequestsPage() {
  return <Suspense fallback={null}><MyRequestsPage /></Suspense>;
}
