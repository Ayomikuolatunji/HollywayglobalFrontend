import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../components/DashboardEmptyState";
import DashboardPageHeader from "../components/DashboardPageHeader";
import DashboardSummaryCard from "../components/DashboardSummaryCard";

const walletCards = [["AVAILABLE BALANCE", "No balance yet", "Funds available for payout will appear here.", "wallet"], ["PENDING PAYOUTS", "No pending payouts", "Payouts in progress will be tracked here.", "clock"], ["PAYOUT HISTORY", "No payout history", "Completed settlements will appear here.", "list"]] as const;

export default function WalletPage() {
  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8">
    <DashboardPageHeader kicker="WALLET & PAYOUTS" title="Track your money." description="Review available funds, pending payouts and your settlement history in one place." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/settings">Payout settings <Arrow /></Link>} />
    <section className="grid gap-3 md:grid-cols-3" aria-label="Wallet summary">{walletCards.map(([label, title, description, icon]) => <DashboardSummaryCard key={label} label={label} value={title} note={description} icon={icon} />)}</section>
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-5"><div className="flex flex-col justify-between gap-3 border-b border-[#eef1f4] pb-5 sm:flex-row sm:items-end"><div><span className="text-xs font-bold text-[#1453bb]">Settlement activity</span><h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">Payout history</h3></div><span className="text-xs font-semibold text-[#8490a4]">No records</span></div><DashboardEmptyState icon="list" title="Your payout history is empty" description="Once an eligible transaction is completed and settled, the reference, amount and status will be shown here." actionHref="/dashboard/profile/kyc" actionLabel="Open KYC" /></section>
    <section className="flex flex-col gap-4 rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-5 sm:flex-row sm:items-center sm:justify-between"><div><span className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">ACCOUNT REQUIREMENT</span><h3 className="mt-2 text-sm font-extrabold text-[#0b1830]">Complete KYC before payout activity</h3><p className="mt-1 text-xs leading-5 text-[#53627a]">You can continue creating work as Draft, but verification is required before payout-related activity can proceed.</p></div><Link className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" href="/dashboard/profile/kyc">Open KYC <Arrow /></Link></section>
  </div>;
}
