"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import WalletServicePaymentButton from "../../dashboard/components/WalletServicePaymentButton";
import ServicePageHeader from "../components/ServicePageHeader";
import { acceptProfessionalQuote, fetchProfessionalRequest, reviewProfessionalRequest, type ProfessionalRequest } from "../data/professional";

function money(value: number | null) { return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`; }
function date(value: string | null) { return value ? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "Not set"; }

export default function ProfessionalRequestDetailsPage({ reference }: { reference: string }) {
  const [request, setRequest] = useState<ProfessionalRequest | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function load() { try { setRequest(await fetchProfessionalRequest(reference)); } catch (reason) { setError(reason instanceof ApiResponseError ? reason.message : "Professional request could not be loaded."); } }
  useEffect(() => { void load(); }, [reference]);
  async function accept(quoteId: string) { setBusy(true); setError(""); try { setRequest(await acceptProfessionalQuote(reference, quoteId)); } catch (reason) { setError(reason instanceof ApiResponseError ? reason.message : "Quotation could not be accepted."); } finally { setBusy(false); } }
  async function review() { setBusy(true); setError(""); try { setRequest(await reviewProfessionalRequest(reference, rating, comment)); } catch (reason) { setError(reason instanceof ApiResponseError ? reason.message : "Professional review could not be saved."); } finally { setBusy(false); } }

  if (error && !request) return <div className="mx-auto max-w-[900px] p-5 sm:p-8"><p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-4 text-xs font-semibold text-[#a32929]">{error}</p><Link className="mt-4 inline-flex text-xs font-extrabold text-[#1453bb]" href="/dashboard/services">Back to professional requests <Arrow /></Link></div>;
  if (!request) return <div className="mx-auto max-w-[900px] p-5 text-xs font-bold text-[#687895] sm:p-8">Loading professional request…</div>;

  return <div className="mx-auto max-w-[1120px] space-y-5 p-5 sm:p-8">
    <ServicePageHeader kicker={request.reference} title={request.category_label} description="Review the service details, quotations and the next Hollyway workflow step." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/services">Back to professional requests <Arrow /></Link>} />
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">REQUEST STATUS</p><p className="mt-1 text-lg font-extrabold text-[#0b1830]">{request.status_label}</p></div><p className="text-xs text-[#53627a]">Created {date(request.created_at)}</p></div>
    {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">
      <section className="space-y-5">
        <InfoSection title="Service request"><div className="grid gap-3 sm:grid-cols-2"><Info label="Client" value={request.client_full_name} /><Info label="WhatsApp" value={request.client_phone_e164} /><Info label="Preferred time" value={date(request.preferred_at)} /><Info label="Target budget" value={money(request.target_budget_minor)} /><Info label="Property" value={request.move_in_status_label} /><Info label="Materials" value={request.materials_arrangement_label} /><Info label="Address" value={`${request.service_street}, ${request.service_area}, ${request.service_city}, ${request.service_state}`} /></div><div className="mt-3 rounded-lg bg-[#f8fafc] p-3"><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#8290a8]">Task details</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#53627a]">{request.task_description || "Not added"}</p></div></InfoSection>
        <InfoSection title="Professional quotations">{request.quotes.length ? <div className="space-y-3">{request.quotes.map((quote) => <article className="rounded-lg border border-[#dfe4ed] p-4" key={quote.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-extrabold text-[#0b1830]">{quote.provider_name}</h3><p className="mt-1 text-[11px] text-[#687895]">{quote.provider_phone_e164}</p></div><strong className="text-sm text-[#1453bb]">{money(quote.amount_minor)}</strong></div><p className="mt-3 text-xs leading-5 text-[#53627a]">{quote.details || "No additional quotation details."}</p>{request.status === "quotes_ready" && quote.status === "proposed" && <button className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" disabled={busy} onClick={() => void accept(quote.id)} type="button">{busy ? "Accepting…" : "Accept quotation"} <Arrow /></button>}{request.status === "quote_accepted" && quote.status === "accepted" && <WalletServicePaymentButton amountMinor={quote.amount_minor} onPaid={() => void load()} reference={request.reference} service="professional" />}</article>)}</div> : <p className="text-xs leading-5 text-[#687895]">Hollyway will add quotations here after the request enters professional matching.</p>}</InfoSection>
        {request.status === "completed" && <InfoSection title="Review the service">{request.review ? <div><p className="text-sm font-extrabold text-[#1453bb]">{"★".repeat(request.review.rating)}<span className="text-[#dfe4ed]">{"★".repeat(5 - request.review.rating)}</span></p><p className="mt-2 text-xs leading-5 text-[#53627a]">{request.review.comment || "No written comment."}</p></div> : <div><p className="text-xs leading-5 text-[#53627a]">Tell Hollyway how the completed professional service went.</p><div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button className={`text-xl ${value <= rating ? "text-[#dd6b12]" : "text-[#dfe4ed]"}`} key={value} onClick={() => setRating(value)} type="button" aria-label={`${value} star${value === 1 ? "" : "s"}`}>★</button>)}</div><textarea className="mt-3 min-h-20 w-full rounded-lg border border-[#dfe4ed] p-3 text-xs" placeholder="Optional comment" value={comment} onChange={(event) => setComment(event.target.value)} /><button className="mt-3 h-9 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" disabled={busy} onClick={() => void review()} type="button">{busy ? "Saving…" : "Save review"}</button></div>}</InfoSection>}
      </section>
      <aside className="space-y-5"><InfoSection title="Next step"><p className="text-xs leading-5 text-[#53627a]">{request.status === "quote_accepted" ? "Your quotation is accepted. Pay from your confirmed Hollyway wallet to book the service." : request.status === "booked" ? "Your service payment is confirmed and Hollyway can coordinate the booking." : request.status === "completed" ? "The service is complete. Keep this reference for support." : "Hollyway will update this request as professionals are matched and quotations are reviewed."}</p>{request.escrow_reference && <Link className="mt-3 inline-flex text-xs font-extrabold text-[#1453bb]" href={`/dashboard/escrow/${request.escrow_reference}`}>Open related escrow <Arrow /></Link>}</InfoSection><InfoSection title="Activity"><div className="space-y-3">{request.status_events.map((event) => <div className="border-l-2 border-[#cfe0f7] pl-3" key={event.id}><p className="text-xs font-extrabold text-[#0b1830]">{event.to_status_label}</p><p className="mt-1 text-[11px] leading-4 text-[#687895]">{event.reason || "Workflow update"} · {date(event.created_at)}</p></div>)}</div></InfoSection></aside>
    </div>
  </div>;
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm"><h2 className="font-[Manrope] text-base font-extrabold tracking-[-.03em] text-[#0b1830]">{title}</h2><div className="mt-4">{children}</div></section>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-[#f8fafc] p-3"><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#8290a8]">{label}</p><p className="mt-1 text-xs font-semibold text-[#31425e]">{value}</p></div>; }
