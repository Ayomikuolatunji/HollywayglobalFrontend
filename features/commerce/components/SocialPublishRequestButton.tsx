"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import {
  fetchAllSocialPublishRequests,
  socialPlatformOptions,
  submitSocialPublishRequest,
  type SocialPlatform,
  type SocialPublishRequest,
} from "../data/socialApi";

const eligibleStatuses = new Set(["published", "sold", "closed"]);

const statusLabels: Record<SocialPublishRequest["status"], string> = {
  pending_approval: "Pending review",
  approved: "Approved",
  scheduled: "Scheduled",
  publishing: "Publishing",
  published: "Published",
  failed: "Needs attention",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

type Props = {
  reference: string;
  listingName: string;
  listingStatus: string;
};

export default function SocialPublishRequestButton({ reference, listingName, listingStatus }: Props) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(["whatsapp", "facebook"]);
  const [caption, setCaption] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [requests, setRequests] = useState<SocialPublishRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetchAllSocialPublishRequests()
      .then((items) => {
        if (active) setRequests(items.filter((item) => item.listing_reference === reference));
      })
      .catch((reason) => {
        if (active) setError(reason instanceof ApiResponseError ? reason.message : "Publishing history could not be loaded.");
      })
      .finally(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [reference]);

  if (!eligibleStatuses.has(listingStatus)) return null;

  const activeRequest = requests.find((item) => ["pending_approval", "approved", "scheduled", "publishing"].includes(item.status));

  function togglePlatform(platform: SocialPlatform) {
    setPlatforms((current) => current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!platforms.length) {
      setError("Choose at least one social channel.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const created = await submitSocialPublishRequest(reference, {
        platforms,
        caption,
        scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
      });
      setRequests((current) => [created, ...current]);
      setCaption("");
      setScheduledFor("");
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "The social publishing request could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-[#f8fbff] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">SELLING SUPPORT</p>
          <h2 className="mt-1 text-base font-extrabold text-[#0b1830]">Share this listing</h2>
          <p className="mt-1 text-xs leading-5 text-[#53627a]">Ask Hollyway to prepare this listing for the selected social channels after review.</p>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-[#53627a]">{listingName}</span>
      </div>
      {activeRequest ? <ActiveRequest request={activeRequest} /> : <RequestForm platforms={platforms} caption={caption} scheduledFor={scheduledFor} busy={busy} error={error} onToggle={togglePlatform} onCaption={setCaption} onScheduledFor={setScheduledFor} onSubmit={submit} />}
      {!loadingHistory && requests.length > 0 && <RequestHistory requests={requests} />}
      {loadingHistory && <p className="mt-4 text-[11px] text-[#8290a8]">Loading publishing history…</p>}
    </section>
  );
}

function RequestForm({ platforms, caption, scheduledFor, busy, error, onToggle, onCaption, onScheduledFor, onSubmit }: {
  platforms: SocialPlatform[];
  caption: string;
  scheduledFor: string;
  busy: boolean;
  error: string;
  onToggle: (platform: SocialPlatform) => void;
  onCaption: (value: string) => void;
  onScheduledFor: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <fieldset>
        <legend className="text-xs font-extrabold text-[#31425e]">Channels</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {socialPlatformOptions.map((option) => (
            <button className={`rounded-lg border px-3 py-2 text-[11px] font-extrabold ${platforms.includes(option.value) ? "border-[#1453bb] bg-[#1453bb] text-white" : "border-[#dfe4ed] bg-white text-[#53627a]"}`} key={option.value} onClick={() => onToggle(option.value)} type="button">
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-1.5 text-xs font-bold text-[#53627a]">
        Caption (optional)
        <textarea
          className="min-h-20 rounded-lg border border-[#dfe4ed] bg-white p-3 text-xs font-normal"
          maxLength={4000}
          onChange={(event) => onCaption(event.target.value)}
          placeholder="Add the selling context Hollyway should use."
          value={caption}
        />
      </label>
      <label className="grid gap-1.5 text-xs font-bold text-[#53627a]">
        Preferred publishing time (optional)
        <input
          className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-normal"
          min={new Date().toISOString().slice(0, 16)}
          onChange={(event) => onScheduledFor(event.target.value)}
          type="datetime-local"
          value={scheduledFor}
        />
      </label>
      {error && <p className="rounded-lg border border-[#f3c4c4] bg-[#fff5f5] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
      <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-60" disabled={busy} type="submit">{busy ? "Sending…" : "Send for review"}<Arrow /></button>
    </form>
  );
}

function ActiveRequest({ request }: { request: SocialPublishRequest }) {
  return (
    <div className="mt-4 rounded-lg border border-[#dfe4ed] bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-xs text-[#0b1830]">Request {request.reference}</strong>
        <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-extrabold text-[#1453bb]">
          {statusLabels[request.status]}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">
        {request.platforms.join(", ")} · Hollyway is processing this request.
      </p>
    </div>
  );
}

function RequestHistory({ requests }: { requests: SocialPublishRequest[] }) {
  return (
    <div className="mt-4 border-t border-[#dfe4ed] pt-3">
      <p className="text-[10px] font-extrabold tracking-[.12em] text-[#8290a8]">REQUEST HISTORY</p>
      <div className="mt-2 grid gap-2">
        {requests.slice(0, 3).map((request) => (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs" key={request.id}>
            <span className="text-[#53627a]">{request.reference} · {request.platforms.join(", ")}</span>
            <span className="font-extrabold text-[#31425e]">{statusLabels[request.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
