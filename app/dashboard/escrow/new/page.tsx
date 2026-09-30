import { Suspense } from "react";
import EscrowPage from "../../../../features/escrow/pages/EscrowPage";

export default function NewEscrowPage() {
  return <Suspense fallback={<div className="p-6 text-sm font-semibold text-[#53627a]">Loading escrow form…</div>}><EscrowPage /></Suspense>;
}
