import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export default function DashboardPageHeader({
  kicker,
  title,
  description,
  action,
  compact = false,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`flex flex-col justify-between ${
        compact ? "gap-2 pb-4" : "gap-5 pb-7"
      } border-b border-[#dfe4ed] dark:border-[#2a374e] sm:flex-row sm:items-start`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`mt-1 ${compact ? "h-7" : "h-10"} w-1 shrink-0 rounded-full bg-[#ff8a00]`}
          aria-hidden="true"
        />
        <div>
          <span
            className={`font-bold text-[#ff8a00] ${compact ? "text-[9px]" : "text-xs"}`}
          >
            {kicker}
          </span>
          <h2
            className={`font-[Manrope] font-extrabold tracking-[-.05em] text-[#0b1830] dark:text-[#f4f7fb] ${
              compact ? "mt-1 text-lg sm:text-xl" : "mt-2 text-2xl sm:text-3xl"
            }`}
          >
            {title}
          </h2>
          <p
            className={`max-w-2xl text-[#53627a] dark:text-[#9eabc0] ${
              compact ? "mt-1 text-[11px] leading-4" : "mt-2 text-sm leading-6"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
      {action && <div className="shrink-0 sm:pt-1">{action}</div>}
    </header>
  );
}
