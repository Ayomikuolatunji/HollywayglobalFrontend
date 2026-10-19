"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../../../components/SiteHeader";
import { Arrow } from "../../../components/ui/Arrow";
import { fetchPublicTestimonials, type PublicTestimonial } from "../data/testimonialsApi";

const categoryLabels: Record<string, string> = {
  marketplace: "Marketplace",
  escrow: "Escrow",
  logistics: "Deliveries",
  professional: "Professional services",
  events: "Events",
  relocation: "Relocations",
  other: "Hollyway experience",
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchPublicTestimonials(controller.signal)
      .then((result) => setItems(result.items))
      .catch((reason) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Stories could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#eef1f5] text-[#0b1830]">
      <SiteHeader />
      <section className="mx-auto grid w-[calc(100%-40px)] max-w-[1180px] items-center gap-8 py-14 lg:w-[calc(100%-64px)] lg:grid-cols-[1fr_.65fr] lg:py-20">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">CUSTOMER STORIES</span>
          <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold leading-tight tracking-[-.07em] sm:text-6xl">
            Real experiences. <em className="not-italic text-[#ff8a00]">Reviewed before sharing.</em>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#53627a]">
            Read stories shared by Hollyway customers after they use the marketplace, services or protected transaction support.
          </p>
          <Link className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-[#ff8a00] px-4 text-xs font-extrabold text-[#142039]" href="/share-testimonial">
            Share your experience <Arrow />
          </Link>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#061936] to-[#1453bb] p-8 text-white shadow-xl shadow-[#061936]/15">
          <span className="font-serif text-7xl leading-none text-[#ffb11b]">“</span>
          <strong className="mt-4 block font-[Manrope] text-2xl font-extrabold leading-tight tracking-[-.05em]">
            Buy with confidence.<br />Sell with confidence.
          </strong>
          <small className="mt-8 block text-[10px] tracking-[.18em] text-[#c5d2e6]">HOLLYWAY GLOBAL QUICK SALES</small>
        </div>
      </section>
      <section className="mx-auto w-[calc(100%-40px)] max-w-[1180px] pb-20 lg:w-[calc(100%-64px)]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe4ed] pb-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-[.18em] text-[#8995a8]">APPROVED STORIES</span>
            <h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-.06em]">What customers choose to share.</h2>
          </div>
          <Link className="text-xs font-extrabold text-[#1453bb] hover:underline" href="/login?next=%2Fshare-testimonial">Sign in to share yours</Link>
        </div>
        {error && <p className="mt-6 rounded-xl border border-[#f1c8c3] bg-[#fff5f3] p-4 text-xs font-semibold text-[#a32929]">{error}</p>}
        {loading ? (
          <div className="mt-8 rounded-xl border border-[#dfe4ed] bg-white p-10 text-center text-xs font-bold text-[#687895]">Loading approved stories…</div>
        ) : items.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => <TestimonialCard item={item} key={item.id} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-[#cbd5e1] bg-white p-10 text-center">
            <strong className="block text-sm font-extrabold text-[#0b1830]">No customer stories have been approved yet.</strong>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#687895]">Once a customer shares an experience and Hollyway reviews it, the approved story will appear here.</p>
            <Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/share-testimonial">Share your experience <Arrow /></Link>
          </div>
        )}
      </section>
      <footer className="bg-[#061936] py-7 text-[#c5d2e6]">
        <div className="mx-auto flex w-[calc(100%-40px)] max-w-[1180px] flex-col justify-between gap-3 text-xs sm:flex-row lg:w-[calc(100%-64px)]">
          <Link className="font-bold hover:text-white" href="/">← Return to Hollyway Global Quick Sales</Link>
          <span>© 2026 Hollyway Global</span>
        </div>
      </footer>
    </main>
  );
}

function TestimonialCard({ item }: { item: PublicTestimonial }) {
  const attribution = [item.display_name, item.business_name, item.city].filter(Boolean).join(" · ");
  return (
    <article className="flex min-h-[245px] flex-col rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-[10px] font-extrabold tracking-[.12em] text-[#1453bb]">
        <span>{categoryLabels[item.category] || "Hollyway experience"}</span>
        <span className="rounded-full bg-[#edf8f1] px-2 py-1 text-[9px] tracking-normal text-[#1f7a5c]">Approved</span>
      </div>
      <span className="mt-5 font-serif text-5xl leading-none text-[#ff8a00]">“</span>
      <h3 className="mt-2 font-[Manrope] text-lg font-extrabold leading-tight text-[#0b1830]">{item.headline}</h3>
      <p className="mt-3 flex-1 text-xs leading-5 text-[#53627a]">{item.quote}</p>
      <footer className="mt-5 border-t border-[#eef1f4] pt-4 text-[10px] font-bold text-[#1453bb]">{attribution || "Verified Hollyway customer"}</footer>
    </article>
  );
}
