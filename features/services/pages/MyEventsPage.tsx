"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import ServicePageHeader from "../components/ServicePageHeader";
import { fetchEvents, formatEventMoney, type EventRequest } from "../data/events";

const tabs = [
  { value: "all", label: "All events" },
  { value: "draft", label: "Drafts" },
  { value: "active", label: "In progress" },
  { value: "completed", label: "Completed" },
] as const;

function matches(event: EventRequest, tab: string) {
  if (tab === "all") return true;
  if (tab === "draft") return event.status === "draft";
  if (tab === "completed") return event.status === "completed";
  return !["draft", "completed", "cancelled"].includes(event.status);
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventRequest[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((reason) => setError(reason instanceof ApiResponseError ? reason.message : "Events could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const visible = events.filter((event) => matches(event, tab));
  return (
    <div className="mx-auto max-w-[1120px] space-y-5 p-4 sm:p-7">
      <ServicePageHeader
        kicker="EVENT PLANNING"
        title="My events"
        description="Keep event requests, vendor quotations, assignments and the event payment record in one place."
        action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/events/new">Plan an event <Arrow /></Link>}
      />
      {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
      <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm">
        <FilterTabs events={events} selected={tab} onSelect={setTab} />
        {loading ? <Loading /> : visible.length ? <div className="divide-y divide-[#eef1f4]">{visible.map((event) => <EventCard event={event} key={event.reference} />)}</div> : <EmptyEvents />}
      </section>
    </div>
  );
}

function FilterTabs({ events, selected, onSelect }: { events: EventRequest[]; selected: string; onSelect: (value: string) => void }) {
  return <div className="flex gap-5 overflow-x-auto border-b border-[#eef1f4]" role="tablist" aria-label="Event filters">
    {tabs.map((item) => <button className={`relative shrink-0 pb-3 text-xs font-extrabold ${selected === item.value ? "text-[#1453bb] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1453bb]" : "text-[#8290a8]"}`} key={item.value} onClick={() => onSelect(item.value)} role="tab" aria-selected={selected === item.value} type="button">
      {item.label} <span className="ml-1 rounded-full bg-[#f1f5fb] px-1.5 py-0.5 text-[10px]">{item.value === "all" ? events.length : events.filter((event) => matches(event, item.value)).length}</span>
    </button>)}
  </div>;
}

function Loading() { return <div className="py-16 text-center text-xs font-bold text-[#687895]">Loading event requests…</div>; }
function EmptyEvents() { return <div className="py-16 text-center"><h2 className="text-sm font-extrabold text-[#0b1830]">No event requests here</h2><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#687895]">Start with the event type, date, full venue address, supplies and target budget Hollyway needs to coordinate vendors.</p><Link className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/events/new">Plan an event <Arrow /></Link></div>; }

function EventCard({ event }: { event: EventRequest }) {
  return <article className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[10px] font-extrabold text-[#1453bb]">{event.status_label}</span><span className="text-[10px] font-bold text-[#8290a8]">{event.reference}</span></div>
      <h2 className="mt-2 text-base font-extrabold text-[#0b1830]">{event.event_type_label} · {event.guest_count ? `${event.guest_count} guests` : "Guest count pending"}</h2>
      <p className="mt-1 truncate text-xs text-[#53627a]">{event.venue_address || "Venue address pending"}</p>
      <p className="mt-2 text-xs text-[#687895]">{event.services.length} service or supply request{event.services.length === 1 ? "" : "s"} · {formatEventMoney(event.target_budget_minor)}</p>
    </div>
    <Link className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href={`/dashboard/events/${encodeURIComponent(event.reference)}`}>View request <Arrow /></Link>
  </article>;
}
