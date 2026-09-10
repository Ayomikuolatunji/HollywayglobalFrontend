"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import HelpArticleList from "../components/HelpArticleList";
import HelpIcon from "../components/HelpIcon";
import SupportRequestForm from "../components/SupportRequestForm";
import SupportTicketList from "../components/SupportTicketList";
import {
  fetchHelpContent,
  fetchSupportTickets,
  type HelpArticle,
  type HelpCategory,
  type HelpTicket,
} from "../data/helpApi";

export default function HelpPage() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("all");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  const loadContent = useCallback(async () => {
    setContentLoading(true);
    setContentError("");
    try {
      const content = await fetchHelpContent();
      setCategories(content.categories);
      setArticles(content.articles);
    } catch (error) {
      setContentError(error instanceof Error ? error.message : "Help content could not be loaded.");
    } finally {
      setContentLoading(false);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    setTicketsLoading(true);
    setTicketsError("");
    try {
      setTickets(await fetchSupportTickets());
    } catch (error) {
      setTicketsError(error instanceof Error ? error.message : "Your support requests could not be loaded.");
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
    void loadTickets();
  }, [loadContent, loadTickets]);

  const categoryLabels = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories],
  );
  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (topic !== "all" && article.category !== topic) return false;
      if (!query) return true;
      return [article.title, article.summary, article.body, ...article.keywords]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [articles, search, topic]);

  function addTicket(ticket: HelpTicket) {
    setTickets((current) => [ticket, ...current]);
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-5 p-4 pb-16 sm:p-6 lg:p-8">
      <DashboardPageHeader
        kicker="SUPPORT"
        title="Help centre"
        description="Find clear answers about your Hollyway account, transactions and service pathways."
        action={
          <Link
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline"
            href="/dashboard"
          >
            Back to overview <Arrow />
          </Link>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-[#e4e2da] bg-white p-5 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
              <HelpIcon name="book" />
            </span>
            <div>
              <h2 className="font-[Manrope] text-lg font-semibold text-[#12141c]">
                What can we help you understand?
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#5c5f6b]">
                Search the guidance or choose a product area.
              </p>
            </div>
          </div>
          <label className="relative mt-5 block">
            <span className="sr-only">Search help articles</span>
            <input
              className="h-11 w-full rounded-lg border border-[#dfe4ed] bg-[#f8f7f3] px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#8995a8] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search KYC, listings, escrow, wallet…"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Help topics">
            <button
              className={`rounded-full px-3 py-2 text-[10px] font-bold ${topic === "all" ? "bg-[#14213d] text-white" : "bg-[#f3f4f7] text-[#53627a] hover:bg-[#e9edf4]"}`}
              type="button"
              onClick={() => setTopic("all")}
            >
              All topics
            </button>
            {categories.map((category) => (
              <button
                className={`rounded-full px-3 py-2 text-[10px] font-bold ${topic === category.id ? "bg-[#14213d] text-white" : "bg-[#f3f4f7] text-[#53627a] hover:bg-[#e9edf4]"}`}
                type="button"
                onClick={() => setTopic(category.id)}
                key={category.id}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-[#eef1f4] pt-4">
            {contentLoading ? (
              <p className="py-5 text-xs text-[#8995a8]">Loading Hollyway guidance…</p>
            ) : contentError ? (
              <div
                className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4 text-xs leading-5 text-[#6b5a3d]"
                role="alert"
              >
                <p>{contentError}</p>
                <button
                  className="mt-3 font-bold underline"
                  type="button"
                  onClick={() => void loadContent()}
                >
                  Try again
                </button>
              </div>
            ) : (
              <HelpArticleList
                articles={visibleArticles}
                categoryLabels={categoryLabels}
              />
            )}
          </div>
        </section>
        <aside className="grid content-start gap-5">
          <SupportRequestForm categories={categories} onSubmitted={addTicket} />
          <SupportTicketList
            tickets={tickets}
            categoryLabels={categoryLabels}
            loading={ticketsLoading}
            error={ticketsError}
          />
        </aside>
      </div>
    </div>
  );
}
