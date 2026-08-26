import { Suspense } from "react";
import MyListingsPage from "../../../features/commerce/pages/MyListingsPage";

export default function ListingsPage() {
  return <Suspense fallback={null}><MyListingsPage /></Suspense>;
}
