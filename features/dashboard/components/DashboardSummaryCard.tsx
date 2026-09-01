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
};

const toneClasses = {
  blue: "bg-[#edf4ff] text-[#1453bb]",
  purple: "bg-[#f3edff] text-[#6b45c7]",
  green: "bg-[#e3f7e9] text-[#168046]",
  neutral: "bg-[#f8fafc] text-[#53627a]",
};

export default function DashboardSummaryCard({ label, value, note, icon, href, onClick, tone = "blue", compact = false }: DashboardSummaryCardProps) {
  const content = <><span className={`grid ${compact ? "h-8 w-8" : "h-10 w-10"} shrink-0 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${toneClasses[tone]}`}><DashboardIcon name={icon} /></span><span className="min-w-0"><small className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">{label}</small><strong className={`mt-1 block font-[Manrope] ${compact ? "text-base" : "text-xl"} font-extrabold text-[#0b1830]`}>{value}</strong><span className="mt-1 block text-[10px] text-[#8490a4]">{note}</span></span></>;
  const interactiveClass = `group flex items-start gap-3 rounded-lg border border-[#dfe4ed] bg-white ${compact ? "p-3" : "p-4"} text-left transition hover:border-[#b9c8dd] hover:bg-[#fbfcfe] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1453bb]/15`;

  if (href) return <Link className={interactiveClass} href={href} aria-label={`${label}: ${note}`}>{content}</Link>;
  if (onClick) return <button className={`w-full ${interactiveClass}`} type="button" onClick={onClick} aria-label={`${label}: ${note}`}>{content}</button>;
  return <article className={`flex items-start gap-3 rounded-lg border border-[#dfe4ed] bg-white ${compact ? "p-3" : "p-4"}`}>{content}</article>;
}
