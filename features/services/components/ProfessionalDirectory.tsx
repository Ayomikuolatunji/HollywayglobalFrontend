"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import PaginationControls from "../../../components/ui/PaginationControls";
import { Arrow } from "../../../components/ui/Arrow";
import { ApiResponseError } from "../../../components/api/apiResponse";
import {
  fetchProfessionalDirectory,
  professionalCategories,
  professionalPortfolioUrl,
  type ProfessionalDirectoryPage,
} from "../data/professional";

const tradeOptions = [
  { value: "", label: "All trades", tip: "Browse every approved service professional." },
  ...professionalCategories.map(([value, label]) => ({
    value,
    label,
    tip: `Browse approved professionals offering ${label.toLowerCase()} services.`,
  })),
];

export default function ProfessionalDirectory() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [trade, setTrade] = useState("");
  const [submitted, setSubmitted] = useState({ query: "", location: "", trade: "" });
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<ProfessionalDirectoryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void fetchProfessionalDirectory({ ...submitted, page: pageNumber })
      .then((result) => { if (active) setPage(result); })
      .catch((reason) => {
        if (active) setError(reason instanceof ApiResponseError ? reason.message : "The professional directory could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [submitted, pageNumber]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPageNumber(1);
    setSubmitted({ query: query.trim(), location: location.trim(), trade });
  }

  return <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5" aria-labelledby="professional-directory-title">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#eef1f4] pb-4">
      <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">VERIFIED PROFESSIONAL DIRECTORY</p><h2 id="professional-directory-title" className="mt-1 text-lg font-extrabold tracking-[-.03em] text-[#0b1830]">Find a service professional</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#53627a]">Browse approved service-giver profiles, coverage, experience, portfolio work and customer ratings before you submit a request.</p></div>
      <span className="text-[10px] font-semibold text-[#687895]">{page?.total ?? 0} verified profile{page?.total === 1 ? "" : "s"}</span>
    </div>
    <form className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_minmax(0,1fr)_auto] md:items-end" onSubmit={search}>
      <label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Search<input className="h-10 rounded-lg border border-[#dfe4ed] px-3 text-xs font-medium outline-none focus:border-[#1453bb]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, trade or coverage" /></label>
      <Dropdown compact label="Trade" options={tradeOptions} value={trade} onChange={setTrade} showSelectedTip={false} />
      <label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Location<input className="h-10 rounded-lg border border-[#dfe4ed] px-3 text-xs font-medium outline-none focus:border-[#1453bb]" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, state or LGA" /></label>
      <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-[10px] font-extrabold text-white disabled:opacity-50" type="submit" disabled={loading}>Search <Arrow /></button>
    </form>
    {error && <p className="mt-4 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
    {loading ? <p className="py-10 text-center text-xs font-semibold text-[#687895]">Loading approved professionals…</p> : page?.items.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{page.items.map((provider) => <ProviderCard provider={provider} key={provider.id} />)}</div> : <div className="mt-4 rounded-lg border border-dashed border-[#cfd8e6] p-8 text-center"><h3 className="text-sm font-extrabold text-[#0b1830]">No approved professionals match this search</h3><p className="mt-2 text-xs leading-5 text-[#687895]">Try another trade or location, or submit a request and Hollyway will help match the work.</p></div>}
    {page && <PaginationControls page={page.page} totalPages={page.total_pages} hasPrevious={page.has_previous} hasNext={page.has_next} onPageChange={setPageNumber} />}
  </section>;
}

function ProviderCard({ provider }: { provider: ProfessionalDirectoryPage["items"][number] }) {
  const preview = provider.portfolio[0];
  return <article className="overflow-hidden rounded-lg border border-[#eef1f4] bg-[#fbfcfe]">
    {preview ? preview.mime_type.startsWith("video/") ? <video className="h-36 w-full bg-[#0b1830] object-cover" controls preload="metadata" src={professionalPortfolioUrl(preview)} /> : <img className="h-36 w-full object-cover" src={professionalPortfolioUrl(preview)} alt={`${provider.display_name} portfolio`} loading="lazy" /> : <div className="grid h-36 place-items-center bg-[#edf4ff] px-4 text-center text-[10px] font-bold text-[#31527f]">Portfolio available after profile review</div>}
    <div className="p-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#0b1830]">{provider.display_name}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#1453bb]">{provider.trade_specialization}</p></div><span className="shrink-0 rounded-full bg-[#eaf8ef] px-2 py-1 text-[9px] font-extrabold text-[#168046]">{provider.status_label}</span></div><p className="mt-3 line-clamp-2 text-[11px] leading-4 text-[#53627a]">{provider.coverage || provider.base_address}</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-[#687895]"><span>{provider.years_experience} year{provider.years_experience === 1 ? "" : "s"} experience</span><span>{provider.review_count ? `${provider.rating_average ?? 0}/5 · ${provider.review_count} review${provider.review_count === 1 ? "" : "s"}` : "No reviews yet"}</span></div><Link className="mt-3 inline-flex h-8 items-center gap-2 text-[10px] font-extrabold text-[#1453bb] hover:underline" href="/dashboard/services/new">Start a service request <Arrow /></Link></div>
  </article>;
}
