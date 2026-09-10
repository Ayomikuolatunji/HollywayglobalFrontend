"use client";

import { useEffect } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";

type MarketplaceFilterDrawerProps = {
  open: boolean;
  resultCount: number;
  category: string;
  condition: string;
  deliveryMethod: string;
  minimumPrice: string;
  maximumPrice: string;
  featuredOnly: boolean;
  categoryOptions: readonly DropdownOption[];
  conditionOptions: readonly DropdownOption[];
  deliveryOptions: readonly DropdownOption[];
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onDeliveryChange: (value: string) => void;
  onMinimumPriceChange: (value: string) => void;
  onMaximumPriceChange: (value: string) => void;
  onFeaturedChange: (value: boolean) => void;
  onClear: () => void;
  onClose: () => void;
};

function CloseIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-NG") : "";
}

export default function MarketplaceFilterDrawer(props: MarketplaceFilterDrawerProps) {
  useEffect(() => {
    if (!props.open) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") props.onClose(); }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [props.open, props.onClose]);

  return (
    <>
      <button className={`fixed inset-0 z-40 bg-[#12141c]/35 transition ${props.open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`} type="button" onClick={props.onClose} aria-label="Close filters" />
      <aside className={`fixed bottom-0 right-0 top-auto z-50 h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl transition-transform sm:top-0 sm:h-full sm:max-w-[360px] sm:rounded-none ${props.open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-full sm:translate-y-0"}`} aria-hidden={!props.open} aria-label="Marketplace filters">
        <div className="flex items-center justify-between border-b border-[#e4e2da] pb-4">
          <div><span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#9498a3]">REFINE RESULTS</span><h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#12141c]">Filters</h2></div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#e4e2da] text-[#5c5f6b] hover:bg-[#f5f4f0]" type="button" onClick={props.onClose} aria-label="Close filters"><CloseIcon /></button>
        </div>

        <div className="mt-5 grid gap-5">
          <Dropdown compact showSelectedTip={false} required={false} label="Item category" options={props.categoryOptions} value={props.category} onChange={props.onCategoryChange} />
          <div className="grid gap-2"><span className="text-[10px] font-extrabold text-[#31425e]">Price range (₦)</span><div className="grid grid-cols-2 gap-2"><input className="h-10 rounded-lg border border-[#dfe4ed] px-3 text-xs outline-none focus:border-[#14213d]" inputMode="numeric" placeholder="Minimum" value={props.minimumPrice} onChange={(event) => props.onMinimumPriceChange(formatAmount(event.target.value))} /><input className="h-10 rounded-lg border border-[#dfe4ed] px-3 text-xs outline-none focus:border-[#14213d]" inputMode="numeric" placeholder="Maximum" value={props.maximumPrice} onChange={(event) => props.onMaximumPriceChange(formatAmount(event.target.value))} /></div></div>
          <Dropdown compact showSelectedTip={false} required={false} label="Condition" options={props.conditionOptions} value={props.condition} onChange={props.onConditionChange} />
          <Dropdown compact showSelectedTip={false} required={false} label="Delivery method" options={props.deliveryOptions} value={props.deliveryMethod} onChange={props.onDeliveryChange} />
          <label className="flex items-center gap-3 rounded-lg border border-[#e4e2da] p-3 text-xs font-semibold text-[#31425e]"><input className="h-4 w-4 accent-[#dd6b12]" type="checkbox" checked={props.featuredOnly} onChange={(event) => props.onFeaturedChange(event.target.checked)} />Featured listings only</label>
        </div>

        <div className="mt-7 grid grid-cols-[auto_1fr] gap-2 border-t border-[#e4e2da] pt-5"><button className="h-11 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" type="button" onClick={props.onClear}>Clear</button><button className="h-11 rounded-lg bg-[#dd6b12] px-4 text-xs font-extrabold text-white hover:bg-[#b8560d]" type="button" onClick={props.onClose}>Show {props.resultCount} listing{props.resultCount === 1 ? "" : "s"}</button></div>
      </aside>
    </>
  );
}
