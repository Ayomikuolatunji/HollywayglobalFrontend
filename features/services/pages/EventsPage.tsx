"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import MultiChoiceField from "../../../components/forms/MultiChoiceField";
import { Arrow } from "../../../components/ui/Arrow";
import ServiceField from "../components/ServiceField";
import ServicePageHeader from "../components/ServicePageHeader";
import { fetchEvent, saveEvent, type EventRequest, type EventServiceType, type EventType } from "../data/events";

const services = [
  ["catering", "Catering and chefs"],
  ["bulk_drinks", "Bulk drinks and bottled water"],
  ["planner", "Event planner and coordination"],
  ["decorator", "Decoration and styling"],
  ["canopies_tents", "Canopies and tents"],
  ["tables_chairs", "Tables and chairs"],
  ["cooling_vans", "Cooling vans"],
  ["sound_generator", "Sound and generator"],
] as const;
const serviceLookup = Object.fromEntries(
  services.map(([value, label]) => [label, value]),
) as Record<string, EventServiceType>;
const eventTypes = [
  { value: "wedding", label: "Wedding", tip: "Wedding planning, catering and supplies." },
  { value: "birthday", label: "Birthday", tip: "Birthday parties and family celebrations." },
  { value: "corporate", label: "Corporate", tip: "Corporate meetings, launches and office events." },
  { value: "funeral", label: "Funeral", tip: "Funeral support, catering and supplies." },
  { value: "housewarming", label: "Housewarming", tip: "Housewarming gatherings and setup." },
] as const;

function money(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits) * 100 : null;
}

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function budgetValue(value: number | null) {
  return value === null ? "" : String(value / 100);
}

export default function EventsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [draftReference, setDraftReference] = useState("");
  const [draft, setDraft] = useState<EventRequest | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference") || "";
    setDraftReference(reference);
    if (!reference) {
      setLoadingDraft(false);
      return;
    }
    fetchEvent(reference)
      .then(setDraft)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The event Draft could not be loaded."))
      .finally(() => setLoadingDraft(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const action = String(form.get("action") || "draft") as "draft" | "submit";
    const date = String(form.get("event_at") || "");
    setSaving(true);
    setError("");
    setSaved("");
    try {
      const request = await saveEvent({
        action,
        eventType: String(form.get("event_type") || "wedding") as EventType,
        eventAt: date ? new Date(date).toISOString() : null,
        venueAddress: String(form.get("venue_address") || ""),
        guestCount: Number(form.get("guest_count")) || null,
        services: form.getAll("services").flatMap((value) => {
          const serviceType = serviceLookup[String(value)];
          return serviceType ? [{ serviceType, note: "" }] : [];
        }),
        requirements: String(form.get("requirements") || ""),
        targetBudgetMinor: money(String(form.get("target_budget") || "")),
        termsAccepted: form.get("terms") === "on",
      }, draftReference || undefined);
      setDraftReference(request.reference);
      setDraft(request);
      if (action === "submit") {
        window.location.assign(`/dashboard/events/${encodeURIComponent(request.reference)}`);
        return;
      }
      window.history.replaceState(null, "", `/dashboard/events/new?reference=${encodeURIComponent(request.reference)}`);
      setSaved(`${request.reference} · ${request.status_label}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The event request could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1040px] space-y-5 p-4 sm:p-7">
      <ServicePageHeader
        kicker="EVENT PLANNING, CATERING & BULK PARTY SUPPLIES"
        title="Plan the event around one clear request."
        description="Tell Hollyway the event type, venue, guest count, supplies and budget. We review the request, coordinate vendors and keep quotations together."
        action={
          <Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/events">
            Back to events <Arrow />
          </Link>
        }
      />
      {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
      {saved && <p className="rounded-lg border border-[#c8e6d0] bg-[#f4fcf6] p-3 text-xs font-semibold text-[#216b39]">{saved}. You can review it in My events.</p>}
      {loadingDraft ? <p className="rounded-lg border border-[#dfe4ed] bg-white p-4 text-xs font-semibold text-[#687895]">Loading Draft…</p> : null}
      {!loadingDraft && <EventForm draft={draft} saving={saving} onSubmit={submit} />}
    </div>
  );
}

function EventForm({ draft, saving, onSubmit }: { draft: EventRequest | null; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const serviceLabels = new Set<string>(services.map(([, label]) => label));
  const selectedServices = draft?.services.map((item) => item.service_label).filter((label) => serviceLabels.has(label)) || [];
  return <form className="space-y-5 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-6" onSubmit={onSubmit}>
        <div className="border-b border-[#eef1f4] pb-4">
          <h2 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Event request</h2>
          <p className="mt-1 text-xs leading-5 text-[#687895]">Your signed-in Hollyway account is used for contact and request history. Save a Draft at any time.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Dropdown label="Event type" name="event_type" options={eventTypes} defaultValue={draft?.event_type} required={false} hint="Choose the event this request is for." />
          <ServiceField label="Event date and time" name="event_at" type="datetime-local" defaultValue={localDateTime(draft?.event_at || null)} placeholder="Choose the planned date and time" required={false} />
          <ServiceField label="Estimated guest count" name="guest_count" type="number" defaultValue={draft?.guest_count ? String(draft.guest_count) : ""} placeholder="e.g. 120" required={false} />
          <ServiceField label="Target event budget (₦)" name="target_budget" defaultValue={budgetValue(draft?.target_budget_minor ?? null)} placeholder="e.g. 1,500,000" required={false} />
        </div>
        <ServiceField label="Full venue address" name="venue_address" defaultValue={draft?.venue_address || ""} placeholder="Street, area, city and state" required={false} />
        <MultiChoiceField label="Services and supplies required" name="services" options={services.map(([, label]) => label)} defaultValues={selectedServices} hint="Select everything Hollyway should coordinate for this event." required={false} />
        <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
          <span>Specific quantities and menu preferences</span>
          <small className="text-[10px] font-medium leading-4 text-[#8995a8]">Add quantities, menu preferences, stage setup, program flow, delivery needs or other requirements.</small>
          <textarea className="min-h-28 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" defaultValue={draft?.requirements || ""} name="requirements" placeholder="e.g. 150 chairs, bottled water, buffet menu and a sound system" />
        </label>
        <label className="flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" defaultChecked={Boolean(draft?.terms_accepted_at)} name="terms" type="checkbox" />I confirm these event details are accurate and agree to Hollyway terms and privacy notice.</label>
        <div className="flex flex-wrap gap-2 border-t border-[#eef1f4] pt-4">
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb] disabled:opacity-50" disabled={saving} name="action" value="draft" type="submit">{saving ? "Saving…" : "Save as Draft"}</button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:opacity-50" disabled={saving} name="action" value="submit" type="submit">Submit event request <Arrow /></button>
        </div>
      </form>;
}
