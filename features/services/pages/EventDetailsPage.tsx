"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import EventProposalPanel from "../components/EventProposalPanel";
import ServicePageHeader from "../components/ServicePageHeader";
import { fetchEvent, formatEventMoney, reviewEvent, type EventRequest } from "../data/events";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "Not set";
}

export default function EventDetailsPage() {
  const reference = typeof window === "undefined" ? "" : decodeURIComponent(window.location.pathname.split("/").pop() || "");
  const [event, setEvent] = useState<EventRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!reference) return;
    fetchEvent(reference)
      .then(setEvent)
      .catch((reason) => setError(reason instanceof ApiResponseError ? reason.message : "Event request could not be loaded."))
      .finally(() => setLoading(false));
  }, [reference]);

  async function saveReview() {
    if (!event) return;
    setReviewing(true);
    setError("");
    try {
      await reviewEvent(event.reference, rating, comment);
      setEvent(await fetchEvent(event.reference));
      setComment("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Review could not be saved.");
    } finally {
      setReviewing(false);
    }
  }

  if (loading) return <div className="p-6 text-xs font-bold text-[#687895]">Loading event request…</div>;
  if (!event) return <EmptyDetails error={error || "Event request was not found."} />;
  return (
    <div className="mx-auto max-w-[1120px] space-y-5 p-4 sm:p-7">
      <ServicePageHeader
        kicker="EVENT REQUEST"
        title={`${event.event_type_label} · ${event.reference}`}
        description="Hollyway keeps the request, quotations, vendor assignments, payment record and status history together for this event."
        action={<div className="flex flex-wrap items-center gap-3"><Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/events">Back to events <Arrow /></Link>{["draft", "needs_information"].includes(event.status) && <Link className="inline-flex h-9 items-center rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href={`/dashboard/events/new?reference=${encodeURIComponent(event.reference)}`}>Continue request</Link>}</div>}
      />
      {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <section className="space-y-4"><RequestPanel event={event} /><ServicesPanel event={event} /><QuotesPanel event={event} /><EventProposalPanel event={event} onChange={setEvent} onError={setError} /></section>
        <aside className="space-y-4"><TimelinePanel event={event} /><AssignmentsPanel event={event} />{event.status === "completed" && !event.review && <ReviewPanel rating={rating} comment={comment} reviewing={reviewing} setRating={setRating} setComment={setComment} saveReview={saveReview} />}</aside>
      </div>
    </div>
  );
}

function RequestPanel({ event }: { event: EventRequest }) {
  return <Panel title="Request details"><dl className="grid gap-4 sm:grid-cols-2"><Info label="Status" value={event.status_label} /><Info label="Event date" value={formatDate(event.event_at)} /><Info label="Venue" value={event.venue_address || "Not set"} /><Info label="Guest count" value={event.guest_count ? event.guest_count.toLocaleString("en-NG") : "Not set"} /><Info label="Target budget" value={formatEventMoney(event.target_budget_minor)} />{event.escrow_reference && <Info label="Related escrow" value={event.escrow_reference} />}</dl>{event.requirements && <div className="mt-4 border-t border-[#eef1f4] pt-4"><span className="text-[10px] font-black uppercase tracking-[.12em] text-[#8290a8]">REQUIREMENTS</span><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#53627a]">{event.requirements}</p></div>}</Panel>;
}

function ServicesPanel({ event }: { event: EventRequest }) {
  return <Panel title="Services and supplies"><div className="grid gap-2 sm:grid-cols-2">{event.services.map((service) => <div className="rounded-lg border border-[#eef1f4] p-3" key={service.id}><p className="text-xs font-extrabold text-[#0b1830]">{service.service_label}</p>{service.note && <p className="mt-1 text-[11px] leading-4 text-[#687895]">{service.note}</p>}</div>)}</div></Panel>;
}

function QuotesPanel({ event }: { event: EventRequest }) {
  return <Panel title="Vendor quotations">{event.quotes.length ? <div className="space-y-2">{event.quotes.map((quote) => <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eef1f4] p-3" key={quote.id}><div><p className="text-xs font-extrabold text-[#0b1830]">{quote.vendor_name}</p><p className="mt-1 text-[11px] text-[#687895]">{event.services.find((service) => service.id === quote.service_id)?.service_label || "Event service"} · {quote.status}</p></div><strong className="text-xs text-[#1453bb]">{formatEventMoney(quote.amount_minor)}</strong></div>)}</div> : <p className="text-xs text-[#687895]">Quotations will appear after Hollyway reviews the request.</p>}</Panel>;
}

function TimelinePanel({ event }: { event: EventRequest }) {
  return <Panel title="Request timeline"><div className="space-y-4">{event.status_events.map((item) => <div className="relative pl-5" key={item.id}><span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#1453bb]" /><p className="text-xs font-extrabold text-[#0b1830]">{item.to_status_label}</p><p className="mt-1 text-[11px] leading-4 text-[#687895]">{item.reason || "Status updated"} · {formatDate(item.created_at)}</p></div>)}</div></Panel>;
}

function AssignmentsPanel({ event }: { event: EventRequest }) {
  return <Panel title="Vendor assignments">{event.assignments.length ? <div className="space-y-2">{event.assignments.map((item) => <div className="rounded-lg border border-[#eef1f4] p-3" key={item.id}><p className="text-xs font-extrabold text-[#0b1830]">{item.vendor_name || "Vendor"}</p><p className="mt-1 text-[11px] text-[#687895]">{item.status} · {item.vendor_phone_e164 || "Contact pending"}</p></div>)}</div> : <p className="text-xs text-[#687895]">No vendor has been assigned yet.</p>}</Panel>;
}

function ReviewPanel({ rating, comment, reviewing, setRating, setComment, saveReview }: { rating: number; comment: string; reviewing: boolean; setRating: (value: number) => void; setComment: (value: string) => void; saveReview: () => Promise<void> }) {
  return <Panel title="Review the completed event"><div className="grid gap-3"><label className="text-xs font-bold text-[#31425e]">Rating<select className="mt-1 h-10 w-full rounded-lg border border-[#dfe4ed] px-2 text-xs" value={rating} onChange={(input) => setRating(Number(input.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label><textarea className="min-h-20 rounded-lg border border-[#dfe4ed] p-2 text-xs" placeholder="Share a short review (optional)" value={comment} onChange={(input) => setComment(input.target.value)} /><button className="h-10 rounded-lg bg-[#1453bb] text-xs font-extrabold text-white disabled:opacity-50" disabled={reviewing} onClick={() => void saveReview()} type="button">{reviewing ? "Saving…" : "Submit review"}</button></div></Panel>;
}

function EmptyDetails({ error }: { error: string }) { return <div className="p-6"><p className="text-sm font-extrabold text-[#a32929]">{error}</p><Link className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/events">Back to events <Arrow /></Link></div>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm"><h2 className="text-sm font-extrabold text-[#0b1830]">{title}</h2><div className="mt-4">{children}</div></section>; }
function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-[10px] font-black uppercase tracking-[.1em] text-[#8290a8]">{label}</dt><dd className="mt-1 text-xs font-semibold leading-5 text-[#31425e]">{value}</dd></div>; }
