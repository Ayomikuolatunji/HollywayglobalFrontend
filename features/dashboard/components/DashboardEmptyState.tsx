import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "./DashboardIcon";

type DashboardEmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  compact?: boolean;
};

export default function DashboardEmptyState({ icon, title, description, actionHref, actionLabel, compact = false }: DashboardEmptyStateProps) {
  return <div className={`flex flex-col items-start ${compact ? "gap-3 py-8" : "gap-4 py-12"} border-t border-[#eef1f4] px-1 sm:flex-row sm:items-center`}><span className={`grid ${compact ? "h-9 w-9" : "h-11 w-11"} shrink-0 place-items-center rounded-md bg-[#edf4ff] text-[#1453bb] [&>svg]:h-5 [&>svg]:w-5`}><DashboardIcon name={icon} /></span><div className="min-w-0 flex-1"><h3 className={`font-[Manrope] ${compact ? "text-base" : "text-lg"} font-extrabold text-[#0b1830]`}>{title}</h3><p className="mt-2 max-w-xl text-xs leading-5 text-[#8490a4]">{description}</p></div><Link className={`inline-flex ${compact ? "h-9 px-3" : "h-10 px-4"} shrink-0 items-center gap-2 rounded-lg bg-[#1453bb] text-xs font-extrabold text-white`} href={actionHref}>{actionLabel} <Arrow /></Link></div>;
}
