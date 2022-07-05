import React from 'react'



interface InputFields{
    type: string
    className?: string
    placeholder?: string
    props?: {
        name?: string
        value?: string
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
        min: number
        max: number
    }
}


const InputField = ({
    type,
    className,
    placeholder,
    props
}:InputFields) => {


  return (
    <div className=''>
        {
            <input  
              type={type} 
              className={`${className}`}
              placeholder={placeholder}
              {...props}
            />
        }
    </div> 
  )
}

export default InputField