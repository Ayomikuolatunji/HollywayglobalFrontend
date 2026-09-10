"use client";

import type { ReactNode } from "react";
import DashboardIcon from "./DashboardIcon";

export const businessInputClass =
  "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10 dark:border-[#33445f] dark:bg-[#0f1a2c] dark:text-[#f4f7fb] dark:placeholder:text-[#71809a]";

export function BusinessUpgradeSection({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30] sm:p-6">
      <div className="flex items-start gap-3 border-b border-[#eef1f4] pb-4 dark:border-[#2a374e]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] dark:bg-[#202d44] dark:text-[#f1b578] [&>svg]:h-4 [&>svg]:w-4">
          <DashboardIcon name={icon} />
        </span>
        <div>
          <h2 className="font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#0b1830] dark:text-[#f4f7fb]">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#53627a] dark:text-[#9eabc0]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function BusinessUpgradeField({
  label,
  value,
  placeholder,
  hint,
  type = "text",
  required = true,
  inputMode,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  hint?: string;
  type?: "email" | "tel" | "text";
  required?: boolean;
  inputMode?: "email" | "numeric" | "tel" | "text";
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e] dark:text-[#b7c3d6]">
      <span>
        {label}
        {required && <em className="ml-1 not-italic text-[#b8560d]">*</em>}
      </span>
      <input
        className={businessInputClass}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <small className="text-[10px] font-medium leading-4 text-[#8995a8] dark:text-[#8190a8]">
          {hint}
        </small>
      )}
    </label>
  );
}
