import type { HelpArticle } from "../data/helpApi";
import HelpIcon from "./HelpIcon";

export default function HelpArticleList({
  articles,
  categoryLabels,
}: {
  articles: HelpArticle[];
  categoryLabels: Map<string, string>;
}) {
  if (!articles.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#d8d5ca] bg-[#f8f7f3] p-8 text-center">
        <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white text-[#14213d] shadow-sm [&>svg]:h-4 [&>svg]:w-4">
          <HelpIcon name="search" />
        </span>
        <h3 className="mt-3 text-sm font-semibold text-[#12141c]">No matching answers</h3>
        <p className="mt-1 text-xs leading-5 text-[#5c5f6b]">
          Try a different search or send Hollyway support a request.
        </p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-[#e4e2da]">
      {articles.map((article) => (
        <details className="group py-4 first:pt-1 last:pb-1" key={article.id}>
          <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
              <HelpIcon name="book" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-bold uppercase tracking-[.1em] text-[#b8560d]">
                {categoryLabels.get(article.category) || "Hollyway help"}
              </span>
              <span className="mt-1 block text-sm font-semibold text-[#12141c]">
                {article.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#5c5f6b]">
                {article.summary}
              </span>
            </span>
            <span className="mt-1 text-lg leading-none text-[#9498a3] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="ml-11 mt-3 max-w-2xl text-xs leading-5 text-[#5c5f6b]">
            {article.body}
          </p>
        </details>
      ))}
    </div>
  );
}
