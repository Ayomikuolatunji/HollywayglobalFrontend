import React from 'react'



interface InputFields{
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder
}


export default function Search({
    value,
    onChange,
    className,
    placeholder
}:InputFields) {
  return  <input
        type={"search"}
        value={value}
        className={`${className}`}
        onChange={onChange}
        placeholder={placeholder || ""}
  />
}
