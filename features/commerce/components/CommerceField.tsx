type InputMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

export default function CommerceField({ label, name, type = "text", placeholder, required = true, defaultValue, inputMode }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string; inputMode?: InputMode }) {
  return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span><input className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} type={type} min={type === "number" ? 0 : undefined} inputMode={inputMode} placeholder={placeholder} defaultValue={defaultValue} required={required} /></label>;
}
