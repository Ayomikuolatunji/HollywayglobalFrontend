"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import Dropdown from "../../../components/forms/Dropdown";
import SiteHeader from "../../../components/SiteHeader";
import { Arrow } from "../../../components/ui/Arrow";
import {
  fetchMyTestimonials,
  submitTestimonial,
  testimonialCategories,
  type CustomerTestimonial,
} from "../data/testimonialsApi";

const emptyForm = {
  category: "marketplace",
  headline: "",
  quote: "",
  display_name: "",
  business_name: "",
  city: "",
  consent: false,
};

export default function ShareTestimonialPage() {
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<CustomerTestimonial[]>([]);
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchMyTestimonials(controller.signal)
      .then((result) => setItems(result.items))
      .catch((reason) => {
        if (reason instanceof ApiResponseError && reason.status === 401) setRequiresSignIn(true);
        else if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Your testimonial history could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function update(name: keyof typeof emptyForm, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const created = await submitTestimonial(form);
      setItems((current) => [created, ...current]);
      setForm(emptyForm);
      setSuccess("Your testimonial was sent for review. It will only appear publicly after Hollyway approves it.");
    } catch (reason) {
      if (reason instanceof ApiResponseError && reason.status === 401) setRequiresSignIn(true);
      setError(reason instanceof Error ? reason.message : "Your testimonial could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eef1f5] text-[#0b1830]">
      <SiteHeader />
      <div className="mx-auto w-[calc(100%-40px)] max-w-[960px] py-10 lg:w-[calc(100%-64px)] lg:py-16">
        <Link className="text-xs font-extrabold text-[#1453bb] hover:underline" href="/testimonials">← Back to customer stories</Link>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 sm:p-7">
            <span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">SHARE YOUR EXPERIENCE</span>
            <h1 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-.06em]">Tell us what Hollyway helped you do.</h1>
            <p className="mt-3 text-sm leading-6 text-[#53627a]">Your story is private until Hollyway reviews it. Never include passwords, identity numbers, payment codes or private documents.</p>
            {requiresSignIn && <p className="mt-5 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-xs font-semibold text-[#6b5a3d]">Sign in to send a testimonial. <Link className="font-extrabold text-[#1453bb] hover:underline" href="/login?next=%2Fshare-testimonial">Go to sign in</Link></p>}
            {error && <p className="mt-5 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
            {success && <p className="mt-5 rounded-lg border border-[#bfe5d0] bg-[#f1fbf5] p-3 text-xs font-semibold text-[#376957]" role="status">{success}</p>}
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <Dropdown
                label="What is your story about?"
                options={testimonialCategories.map((option) => ({
                  ...option,
                  tip: `Choose this for a story about ${option.label.toLowerCase()}.`,
                }))}
                value={form.category}
                onChange={(value) => update("category", value)}
              />
              <TextField label="Headline" value={form.headline} onChange={(value) => update("headline", value)} placeholder="What changed for you?" required minLength={4} maxLength={160} />
              <TextAreaField label="Your experience" value={form.quote} onChange={(value) => update("quote", value)} placeholder="Share what happened, what Hollyway did and what you would tell another customer." required minLength={20} maxLength={2_000} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name to display (optional)" value={form.display_name} onChange={(value) => update("display_name", value)} placeholder="Your first name or preferred name" maxLength={120} />
                <TextField label="Business name (optional)" value={form.business_name} onChange={(value) => update("business_name", value)} placeholder="Business or organisation" maxLength={160} />
              </div>
              <TextField label="City (optional)" value={form.city} onChange={(value) => update("city", value)} placeholder="City" maxLength={80} />
              <label className="flex items-start gap-2 text-xs leading-5 text-[#53627a]">
                <input className="mt-1 accent-[#1453bb]" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} required />
                I consent to Hollyway reviewing this story and publishing it if approved.
              </label>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-50" disabled={submitting || requiresSignIn} type="submit">
                {submitting ? "Sending…" : "Send for review"} <Arrow />
              </button>
            </form>
          </section>
          <section className="h-fit rounded-xl border border-[#dfe4ed] bg-[#061936] p-5 text-white sm:p-6">
            <span className="text-[10px] font-extrabold tracking-[.16em] text-[#ffb11b]">YOUR SUBMISSIONS</span>
            <h2 className="mt-2 text-lg font-extrabold">Review status</h2>
            <SubmissionStatus loading={loading} items={items} />
          </section>
        </div>
      </div>
    </main>
  );
}

function TextField({ label, value, onChange, placeholder, required = false, minLength, maxLength }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; minLength?: number; maxLength?: number }) {
  return (
    <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
      {label}
      <input className="h-11 rounded-lg border border-[#dfe4ed] px-3 text-xs font-medium outline-none focus:border-[#1453bb]" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} minLength={minLength} maxLength={maxLength} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, required, minLength, maxLength }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; minLength?: number; maxLength?: number }) {
  return (
    <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
      {label}
      <textarea className="min-h-32 rounded-lg border border-[#dfe4ed] p-3 text-xs font-medium leading-5 outline-none focus:border-[#1453bb]" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} minLength={minLength} maxLength={maxLength} />
    </label>
  );
}

function SubmissionStatus({ loading, items }: { loading: boolean; items: CustomerTestimonial[] }) {
  if (loading) return <p className="mt-4 text-xs text-[#c5d2e6]">Loading…</p>;
  if (!items.length) return <p className="mt-4 text-xs leading-5 text-[#c5d2e6]">Your submitted stories and review decisions will appear here.</p>;
  return <div className="mt-4 space-y-3">{items.map((item) => <SubmissionRow item={item} key={item.id} />)}</div>;
}

function SubmissionRow({ item }: { item: CustomerTestimonial }) {
  return (
    <div className="rounded-lg border border-white/15 p-3">
      <div className="flex items-center justify-between gap-2">
        <strong className="text-xs">{item.headline}</strong>
        <span className="text-[9px] font-extrabold uppercase text-[#ffb11b]">{item.status}</span>
      </div>
      {item.admin_note && <p className="mt-2 text-[10px] leading-4 text-[#c5d2e6]">{item.admin_note}</p>}
    </div>
  );
}
