import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "./DashboardIcon";

type DashboardServiceCardProps = {
  title: string;
  description: string;
  icon: string;
  href: string;
  className?: string;
  compact?: boolean;
};

export default function DashboardServiceCard({ title, description, icon, href, className = "", compact = false }: DashboardServiceCardProps) {
  return <Link className={`group flex ${compact ? "min-h-[108px] p-3" : "min-h-[132px] p-4"} flex-col rounded-lg border border-[#dfe4ed] bg-white transition hover:border-[#b9c8dd] hover:bg-[#fbfcfe] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1453bb]/15 ${className}`} href={href}>
    <span className={`grid ${compact ? "h-8 w-8" : "h-9 w-9"} place-items-center rounded-md bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4`}><DashboardIcon name={icon} /></span>
    <span className={`${compact ? "mt-3" : "mt-4"} flex items-start gap-3`}>
      <span className="min-w-0 flex-1">
        <strong className={`block ${compact ? "text-xs" : "text-sm"} font-extrabold text-[#0b1830]`}>{title}</strong>
        <span className={`mt-1 block ${compact ? "text-[10px] leading-4" : "text-xs leading-5"} text-[#8490a4]`}>{description}</span>
      </span>
      <span className="mt-0.5 text-[#1453bb] transition-transform group-hover:translate-x-0.5"><Arrow /></span>
    </span>
  </Link>;
}
