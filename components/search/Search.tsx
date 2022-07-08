import React from 'react'



interface InputFields{
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder:string
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
