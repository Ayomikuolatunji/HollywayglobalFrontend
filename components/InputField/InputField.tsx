import React from 'react'



interface InputFields{
    type: string
    className?: string
    placeholder?: string
    props?: {}
}


const InputField = ({
    type,
    className,
    placeholder,
    ...props
}:InputFields) => {


  return (
        <input  
          type={type} 
          className={`${className}`}
          placeholder={placeholder}
          {...props}
        />
  )
}



export default InputField