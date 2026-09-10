import Link from "next/link";
import DashboardIcon from "./DashboardIcon";

type DashboardSummaryCardProps = {
  label: string;
  value: string;
  note: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  tone?: "blue" | "purple" | "green" | "neutral";
  compact?: boolean;
  micro?: boolean;
};

const toneClasses = {
  blue: "bg-[#edf4ff] text-[#1453bb]",
  purple: "bg-[#f3edff] text-[#6b45c7]",
  green: "bg-[#e3f7e9] text-[#168046]",
  neutral: "bg-[#f8fafc] text-[#53627a]",
};

export default function DashboardSummaryCard({ label, value, note, icon, href, onClick, tone = "blue", compact = false, micro = false }: DashboardSummaryCardProps) {
  const content = <><span className={`grid ${micro ? "h-6 w-6" : compact ? "h-8 w-8" : "h-10 w-10"} shrink-0 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${micro ? "[&>svg]:h-3 [&>svg]:w-3" : ""} ${toneClasses[tone]}`}><DashboardIcon name={icon} /></span><span className="min-w-0"><small className={`block font-extrabold text-[#8b97a9] ${micro ? "text-[8px] leading-3 tracking-[.06em]" : "text-[9px] tracking-[.12em]"}`}>{label}</small><strong className={`mt-0.5 block break-words font-[Manrope] ${micro ? "text-xs leading-4 tracking-normal" : compact ? "text-base" : "text-xl"} font-extrabold text-[#0b1830]`}>{value}</strong><span className={`block text-[#8490a4] ${micro ? "mt-0.5 line-clamp-2 text-[8px] leading-3" : "mt-1 text-[10px]"}`}>{note}</span></span></>;
  const interactiveClass = `group flex items-start ${micro ? "gap-2 p-2" : "gap-3"} rounded-lg border border-[#dfe4ed] bg-white ${micro ? "" : compact ? "p-3" : "p-4"} text-left transition hover:border-[#b9c8dd] hover:bg-[#fbfcfe] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1453bb]/15`;

  if (href) return <Link className={interactiveClass} href={href} aria-label={`${label}: ${note}`}>{content}</Link>;
  if (onClick) return <button className={`w-full ${interactiveClass}`} type="button" onClick={onClick} aria-label={`${label}: ${note}`}>{content}</button>;
  return <article className={`flex items-start gap-3 rounded-lg border border-[#dfe4ed] bg-white ${compact ? "p-3" : "p-4"}`}>{content}</article>;
}
