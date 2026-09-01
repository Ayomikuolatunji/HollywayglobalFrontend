type DashboardStatusTabsProps = {
  items: readonly string[];
  active: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  compact?: boolean;
};

export default function DashboardStatusTabs({ items, active, onChange, ariaLabel, compact = false }: DashboardStatusTabsProps) {
  return <div className={`flex ${compact ? "gap-5" : "gap-6"} overflow-x-auto border-b border-[#eef1f4]`} role="tablist" aria-label={ariaLabel}>{items.map((item) => <button className={`relative shrink-0 ${compact ? "py-2 text-[11px]" : "py-3 text-xs"} font-bold ${active === item ? "text-[#1453bb] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1453bb]" : "text-[#8490a4] hover:text-[#31425e]"}`} type="button" role="tab" aria-selected={active === item} onClick={() => onChange(item)} key={item}>{item}</button>)}</div>;
}
