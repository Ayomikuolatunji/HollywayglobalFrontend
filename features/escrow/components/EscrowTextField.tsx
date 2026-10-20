import type { ChangeEvent, HTMLAttributes } from "react";

type EscrowTextFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  readOnly?: boolean;
};

const inputClass =
  "h-10 w-full rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";

export default function EscrowTextField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
  required = true,
  inputMode,
  hint,
  readOnly = false,
}: EscrowTextFieldProps) {
  return (
    <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      {hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}
      <input
        className={inputClass}
        defaultValue={defaultValue}
        inputMode={inputMode}
        name={name}
        onChange={onChange}
        pattern={type === "tel" ? "\\+[0-9][0-9\\(\\) \\x2d]{6,20}" : undefined}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        type={type}
        value={value}
      />
    </label>
  );
}
