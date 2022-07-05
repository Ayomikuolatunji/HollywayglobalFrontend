import React from 'react'
import {  UseFormRegister,Path } from "react-hook-form";


export interface IFormValues {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
}

interface InputFields{
    type?: string
    value?: string
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
    isHookForm?:boolean
    label: Path<IFormValues>;
    register: UseFormRegister<IFormValues>;
    required: boolean;
}


const InputField = ({
    type,
    className,
    placeholder,
    isHookForm,
    label,
    register,
    required,
    value,
    name,
    onChange,
}:InputFields) => {


  return (
         isHookForm ? 
         <input 
           {...register(label, { required })} 
            type={type}
            className={`${className}`} 
            placeholder={placeholder}
         />
         : <input 
             type={type || "text"}
             value={value}
             name={name}
             className={`${className}`}
             placeholder={placeholder || ""}
             onChange={onChange}
           /> 
  )
}


export default InputField