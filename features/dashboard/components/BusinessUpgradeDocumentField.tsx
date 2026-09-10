"use client";

import type { ChangeEvent } from "react";

type BusinessUpgradeDocumentFieldProps = {
  id: string;
  label: string;
  description: string;
  file: File | null;
  existingName?: string;
  onChange: (file: File | null) => void;
};

export default function BusinessUpgradeDocumentField({
  id,
  label,
  description,
  file,
  existingName,
  onChange,
}: BusinessUpgradeDocumentFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.files?.[0] || null);
    event.currentTarget.value = "";
  }

  return (
    <div className="rounded-lg border border-dashed border-[#b9c8dd] bg-[#f8fafc] p-4 dark:border-[#405270] dark:bg-[#0f1a2c]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <strong className="block text-xs font-extrabold text-[#0b1830] dark:text-[#f4f7fb]">
            {label}
          </strong>
          <p className="mt-1 text-[10px] leading-4 text-[#687895] dark:text-[#9eabc0]">
            {description}
          </p>
        </div>
        <label
          className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#1453bb] px-3 text-[11px] font-extrabold text-[#1453bb] hover:bg-[#edf4ff] dark:hover:bg-[#202d44]"
          htmlFor={id}
        >
          {file ? "Replace file" : "Choose file"}
        </label>
      </div>
      <input
        id={id}
        className="sr-only"
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        onChange={handleChange}
      />
      {file ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-[10px] dark:bg-[#18253a]">
          <span className="min-w-0 truncate font-semibold text-[#31425e] dark:text-[#d6deeb]">
            {file.name}
          </span>
          <button
            className="shrink-0 font-extrabold text-[#a32929] hover:underline"
            type="button"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="mt-3 text-[10px] text-[#8995a8] dark:text-[#8190a8]">
          {existingName
            ? `Previously saved: ${existingName}. It will be reused when you submit unless you replace it.`
            : "No file selected. PDF, JPG or PNG up to 10 MB."}
        </p>
      )}
    </div>
  );
}
