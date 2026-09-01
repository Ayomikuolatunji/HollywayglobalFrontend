"use client";

import { useRef } from "react";

type MultiChoiceFieldProps = { label: string; name: string; options: readonly string[]; hint?: string };

export default function MultiChoiceField({ label, name, options, hint = "Choose all that apply." }: MultiChoiceFieldProps) {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  function validateSelection() {
    const boxes = Array.from(fieldsetRef.current?.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`) || []);
    const hasSelection = boxes.some((box) => box.checked);
    boxes.forEach((box) => box.setCustomValidity(hasSelection ? "" : `Select at least one ${label.toLowerCase()}.`));
  }
  return <fieldset ref={fieldsetRef} className="grid gap-3 text-[11px] font-extrabold text-[#31425e]"><legend>{label}</legend><small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small><div className="grid gap-2 sm:grid-cols-2">{options.map((option, index) => <label className="flex items-center gap-2 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-semibold text-[#53627a]" key={option}><input className="accent-[#1453bb]" type="checkbox" name={name} value={option} required={index === 0} onChange={validateSelection} />{option}</label>)}</div></fieldset>;
}
