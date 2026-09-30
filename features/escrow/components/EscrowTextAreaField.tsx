type EscrowTextAreaFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
};

const textareaClass =
  "min-h-24 w-full rounded-lg border border-[#dfe4ed] bg-white px-3 py-2.5 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";

export default function EscrowTextAreaField({
  label,
  name,
  placeholder,
  defaultValue,
  required = true,
  hint,
}: EscrowTextAreaFieldProps) {
  return (
    <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      {hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}
      <textarea
        className={textareaClass}
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
