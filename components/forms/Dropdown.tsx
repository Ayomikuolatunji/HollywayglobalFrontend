"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type DropdownOption = { value: string; label: string; tip?: string };

type DropdownProps = {
  label: string;
  name?: string;
  options: readonly DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  tips?: Record<string, string>;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
  showSelectedTip?: boolean;
};

export function dropdownOptionsFromChildren(children: ReactNode): DropdownOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const props = child.props as { value?: unknown; children?: ReactNode };
    if (child.type === "option") {
      const label = typeof props.children === "string" || typeof props.children === "number" ? String(props.children) : "";
      if (!label) return [];
      return [{ value: props.value === undefined ? label : String(props.value), label }];
    }
    return props.children ? dropdownOptionsFromChildren(props.children) : [];
  });
}

function optionTip(option: DropdownOption, label: string, tips?: Record<string, string>) {
  return option.tip || tips?.[option.value] || tips?.[option.label] || `Choose “${option.label}” when it best matches ${label.toLowerCase()}.`;
}

export default function Dropdown({ label, name, options, value, defaultValue = "", onChange, tips, placeholder = "Select an option", hint, required = true, disabled = false, compact = false, showSelectedTip = true }: DropdownProps) {
  const dropdownId = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [activeTip, setActiveTip] = useState("");
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value === undefined ? internalValue : value;
  const selectedOption = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    function closeWhenOutside(event: MouseEvent) {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveTip("");
      }
    }
    document.addEventListener("mousedown", closeWhenOutside);
    return () => document.removeEventListener("mousedown", closeWhenOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    optionRefs.current[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
  }, [open]);

  function choose(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
    setActiveTip("");
    triggerRef.current?.focus();
  }

  function moveFocus(index: number, direction: 1 | -1) {
    const nextIndex = (index + direction + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[index].value);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return <div className={`grid ${compact ? "gap-1.5 text-[10px]" : "gap-2 text-[11px]"} font-extrabold text-[#31425e]`} ref={fieldRef}>
    <span>{label}</span>
    <div className="relative">
      <button ref={triggerRef} className={`flex ${compact ? "h-10 px-2.5" : "h-11 px-3"} w-full items-center justify-between rounded-lg border border-[#dfe4ed] bg-white text-left text-xs font-medium outline-none transition focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10 ${selectedOption ? "text-[#0b1830]" : "text-[#8995a8]"}`} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${dropdownId}-options`} disabled={disabled} onClick={() => setOpen((current) => !current)} onKeyDown={handleTriggerKeyDown}>
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <svg className={`ml-3 h-4 w-4 shrink-0 text-[#53627a] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {name && <input className="sr-only" type="text" name={name} value={selectedValue} readOnly required={required} tabIndex={-1} aria-hidden="true" />}
      {open && <div id={`${dropdownId}-options`} className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-72 overflow-y-auto rounded-lg border border-[#cbd5e1] bg-white p-1 shadow-xl" role="listbox" aria-label={label}>
        {options.map((option, index) => {
          const tip = optionTip(option, label, tips);
          return <div ref={(element) => { optionRefs.current[index] = element; }} className={`rounded-md ${selectedValue === option.value ? "bg-[#f4f8ff]" : "hover:bg-[#f8fafc]"}`} key={option.value} role="option" aria-selected={selectedValue === option.value} tabIndex={0} onClick={() => choose(option.value)} onKeyDown={(event) => handleOptionKeyDown(event, index)}>
            <div className="flex items-center gap-2 px-3 py-2">
              <span className={`min-w-0 flex-1 text-xs font-semibold ${selectedValue === option.value ? "text-[#1453bb]" : "text-[#31425e]"}`}>{option.label}</span>
              <button className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#cfe0f7] text-[10px] font-extrabold text-[#1453bb] hover:bg-[#edf4ff]" type="button" title={tip} aria-label={`${option.label}: ${tip}`} aria-expanded={activeTip === option.value} onClick={(event) => { event.stopPropagation(); setActiveTip((current) => current === option.value ? "" : option.value); }} onKeyDown={(event) => event.stopPropagation()}>?</button>
            </div>
            {activeTip === option.value && <p className="px-3 pb-3 text-[10px] font-medium leading-4 text-[#687895]">Tip: {tip}</p>}
          </div>;
        })}
      </div>}
    </div>
    {hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}
    {showSelectedTip && selectedOption && <small className="text-[10px] font-medium leading-4 text-[#687895]">Tip: {optionTip(selectedOption, label, tips)}</small>}
  </div>;
}
