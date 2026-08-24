export default function ServiceField({ label, name, type = "text", placeholder, required = true }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span><input className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} type={type} placeholder={placeholder} required={required} /></label>;
}
