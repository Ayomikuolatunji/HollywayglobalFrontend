type InputMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

type CommerceFieldProps = { label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string; inputMode?: InputMode; compact?: boolean };

const fieldClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";
const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const addressClass = "min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const internationalPhonePlaceholder = "Include country code, e.g. +234 801 234 5678";

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SingleField({ label, name, type = "text", placeholder, required = true, defaultValue, inputMode, compact = false }: CommerceFieldProps) {
  const amount = type === "number";
  const fieldPlaceholder = type === "tel" ? internationalPhonePlaceholder : placeholder;
  const helperText = compact ? undefined : name === "deliveryLocation" ? "Street, area, city and state" : fieldPlaceholder;
  return <label className={fieldClass}><span>{label}</span>{helperText ? <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{helperText}</small> : null}{name === "deliveryLocation" ? <textarea className={addressClass} name={name} rows={3} placeholder={helperText} defaultValue={defaultValue} required={required} /> : <input className={inputClass} name={name} type={amount ? "text" : type} min={amount ? 0 : undefined} inputMode={amount ? "numeric" : inputMode} placeholder={fieldPlaceholder} pattern={type === "tel" ? "\\+[0-9][0-9 ()-]{6,20}" : undefined} defaultValue={amount && defaultValue ? formatAmount(defaultValue) : defaultValue} required={required} onChange={amount ? (event) => { event.currentTarget.value = formatAmount(event.currentTarget.value); } : undefined} />}</label>;
}

export default function CommerceField({ label, name, type = "text", placeholder, required = true, defaultValue, inputMode, compact = false }: CommerceFieldProps) {
  const visibleLabel = name === "backupPhone" ? "Alternate phone number" : label;
  const field = <SingleField label={visibleLabel} name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} inputMode={inputMode} compact={compact} />;
  if (name === "budget") return <><SingleField label="Minimum target budget (₦)" name="budget" type="number" placeholder="0" required={required} compact={compact} /><SingleField label="Maximum target budget (₦)" name="budgetMax" type="number" placeholder="0" required={false} compact={compact} /></>;
  if (name === "phone") return <>{field}<SingleField label="Alternate phone number" name="alternatePhone" type="tel" placeholder="A reachable alternative number" required={false} compact={compact} /></>;
  return field;
}
