"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import WalletFundingPanel from "../components/WalletFundingPanel";
import WalletPayoutPanel from "../components/WalletPayoutPanel";
import { fetchAllWalletDeposits, fetchAllWalletLedger, fetchAllWalletPayouts, fetchWallet, type WalletDeposit, type WalletInstructions, type WalletLedgerEntry, type WalletPayout, type WalletSummary } from "../data/walletApi";

const emptySummary: WalletSummary = { available_balance_minor: 0, pending_deposits_minor: 0, service_payments_minor: 0, pending_payouts_minor: 0, payouts_enabled: false, currency: "NGN" };
const emptyInstructions: WalletInstructions = { configured: false };
function money(value: number) { return `₦${(value / 100).toLocaleString("en-NG")}`; }
function statusLabel(value: string) { return value.replaceAll("_", " "); }

export default function WalletPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [instructions, setInstructions] = useState(emptyInstructions);
  const [deposits, setDeposits] = useState<WalletDeposit[]>([]);
  const [ledger, setLedger] = useState<WalletLedgerEntry[]>([]);
  const [payouts, setPayouts] = useState<WalletPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [wallet, deposits, ledger, payouts] = await Promise.all([fetchWallet(), fetchAllWalletDeposits(), fetchAllWalletLedger(), fetchAllWalletPayouts()]);
      setSummary(wallet.summary); setInstructions(wallet.instructions); setDeposits(deposits); setLedger(ledger); setPayouts(payouts);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Wallet information could not be loaded."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function updateDeposit(deposit: WalletDeposit) {
    setDeposits((current) => [deposit, ...current.filter((item) => item.reference !== deposit.reference)]);
    void Promise.all([fetchWallet(), fetchAllWalletDeposits(), fetchAllWalletLedger(), fetchAllWalletPayouts()]).then(([wallet, allDeposits, allLedger, allPayouts]) => { setSummary(wallet.summary); setDeposits(allDeposits); setLedger(allLedger); setPayouts(allPayouts); }).catch(() => undefined);
  }

  function updatePayout(payout: WalletPayout) {
    setPayouts((current) => [payout, ...current.filter((item) => item.reference !== payout.reference)]);
    void Promise.all([fetchWallet(), fetchAllWalletPayouts()]).then(([wallet, allPayouts]) => { setSummary(wallet.summary); setPayouts(allPayouts); }).catch(() => undefined);
  }

  if (loading) return <div className="grid min-h-[420px] place-items-center px-5 text-xs font-bold text-[#687895]">Loading wallet…</div>;
  const activityCount = deposits.length + ledger.length;
  return <div className="w-full space-y-4 px-4 pb-16 pt-1 sm:px-6 lg:px-8"><section className="flex flex-col justify-between gap-3 rounded-[14px] border border-[#e4e2da] bg-white p-5 sm:flex-row sm:items-end"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">WALLET & PAYOUTS</span><h2 className="mt-1 font-[Manrope] text-xl font-semibold text-[#12141c]">Fund your wallet and pay for services</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Deposit money, request approved payouts and review wallet activity from one place.</p></div><Link className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-xs font-bold text-[#14213d] hover:border-[#14213d]" href="/dashboard/settings">Wallet settings <Arrow /></Link></section>{error && <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f1c8c3] bg-[#fff5f3] p-4 text-xs font-semibold text-[#a32929]"><span>{error}</span><button className="font-black underline" type="button" onClick={() => void load()}>Retry</button></div>}<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Wallet summary"><Summary label="AVAILABLE BALANCE" value={money(summary.available_balance_minor)} note="Ready for eligible services" icon="wallet" /><Summary label="PENDING DEPOSITS" value={money(summary.pending_deposits_minor)} note="Awaiting admin confirmation" icon="clock" /><Summary label="SERVICE PAYMENTS" value={money(summary.service_payments_minor)} note="Confirmed wallet debits" icon="shield" /><Summary label="PENDING PAYOUTS" value={summary.payouts_enabled ? money(summary.pending_payouts_minor) : "Unavailable"} note={summary.payouts_enabled ? "Awaiting settlement" : "Payouts require KYC"} icon="list" /></section><section className="grid gap-4 xl:grid-cols-2"><WalletFundingPanel instructions={instructions} onCreated={updateDeposit} /><WalletPayoutPanel enabled={summary.payouts_enabled} balanceMinor={summary.available_balance_minor} onCreated={updatePayout} /></section><section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 sm:p-5"><div className="flex items-end justify-between gap-3 border-b border-[#e4e2da] pb-3"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">WALLET ACTIVITY</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Deposits and service payments</h3></div><span className="text-[10px] text-[#9498a3]">{activityCount ? `${activityCount} record${activityCount === 1 ? "" : "s"}` : "No records"}</span></div>{activityCount ? <div className="divide-y divide-[#e4e2da]">{[...deposits.map((deposit) => ({ key: deposit.reference, title: "Wallet deposit", reference: deposit.reference, amount: deposit.amount_minor, direction: "credit" as const, status: statusLabel(deposit.status), date: deposit.created_at })), ...ledger.map((entry) => ({ key: entry.id, title: entry.description, reference: entry.source_type, amount: entry.amount_minor, direction: entry.direction, status: entry.direction === "credit" ? "confirmed" : "paid", date: entry.created_at }))].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).map((entry) => <article className="grid gap-2 py-3 text-[10px] sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6" key={entry.key}><span><strong className="block text-xs text-[#12141c]">{entry.title}</strong><span className="mt-0.5 block text-[#9498a3]">{entry.reference} · {new Date(entry.date).toLocaleDateString("en-NG")}</span></span><strong className={`font-[Manrope] text-xs ${entry.direction === "debit" ? "text-[#a32929]" : "text-[#1f7a5c]"}`}>{entry.direction === "debit" ? "−" : "+"}{money(entry.amount)}</strong><span className="rounded-full bg-[#f6efdc] px-2 py-1 font-bold capitalize text-[#7a5c00]">{entry.status}</span></article>)}</div> : <div className="flex min-h-28 items-center gap-3 rounded-xl bg-[#f8f7f3] p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#14213d] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="wallet" /></span><span><strong className="block text-xs text-[#12141c]">No wallet activity yet</strong><span className="mt-1 block text-[10px] text-[#5c5f6b]">Deposit references and confirmations will appear here.</span></span></div>}</section><section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 sm:p-5"><div className="flex items-end justify-between gap-3 border-b border-[#e4e2da] pb-3"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">PAYOUT HISTORY</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Requests and settlement status</h3></div><span className="text-[10px] text-[#9498a3]">{payouts.length} record{payouts.length === 1 ? "" : "s"}</span></div>{payouts.length ? <div className="divide-y divide-[#e4e2da]">{payouts.map((payout) => <article className="grid gap-2 py-3 text-[10px] sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6" key={payout.reference}><span><strong className="block text-xs text-[#12141c]">{payout.reference}</strong><span className="mt-0.5 block text-[#9498a3]">{payout.bank_name} · •••• {payout.account_last4}</span></span><strong className="font-[Manrope] text-xs text-[#a32929]">−{money(payout.amount_minor)}</strong><span className="rounded-full bg-[#f1f4f8] px-2 py-1 font-bold capitalize text-[#53627a]">{statusLabel(payout.status)}</span></article>)}</div> : <p className="p-4 text-xs text-[#687895]">No payout requests yet.</p>}</section><section className="flex flex-col gap-3 rounded-xl border border-[#f0c9a0] bg-[#fbe9da] px-4 py-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><strong className="block text-xs text-[#7a4a17]">Wallet funds are confirmed manually</strong><p className="mt-0.5 block text-[10px] leading-4 text-[#7a4a17]">Keep your transfer receipt. Hollyway Admin confirms deposits before the balance changes.</p></div><Link className="shrink-0 text-[10px] font-bold text-[#b8560d] hover:underline" href="/dashboard/profile/kyc">Open KYC</Link></section></div>;
}

function Summary({ label, value, note, icon }: { label: string; value: string; note: string; icon: string }) { return <article className="flex items-center gap-3 rounded-xl border border-t-[3px] border-[#e4e2da] border-t-[#14213d] bg-white p-3.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edeff5] text-[#14213d] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><span className="min-w-0"><small className="block text-[9px] font-bold tracking-[.1em] text-[#9498a3]">{label}</small><strong className="mt-0.5 block font-[Manrope] text-base text-[#12141c]">{value}</strong><span className="block truncate text-[9px] text-[#5c5f6b]">{note}</span></span></article>; }
