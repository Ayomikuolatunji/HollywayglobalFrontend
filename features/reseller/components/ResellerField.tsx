type ResellerFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email";
  onChange?: (value: string) => void;
};

export default function ResellerField({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  value,
  defaultValue,
  inputMode,
  onChange,
}: ResellerFieldProps) {
  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      <input
        className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        inputMode={inputMode}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}

export function ResellerTextArea({
  label,
  name,
  placeholder,
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      <textarea
        className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
    </label>
  );
}
