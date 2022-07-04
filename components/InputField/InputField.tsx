import React from 'react'



interface InputFields{
    type: string
    className?: string
    placeholder?: string
    props?: any
}


const InputField = ({
    type,
    className,
    placeholder,
    ...props
}:InputFields) => {


  return (
    <div className=''>
        {
            type ==="search" ?
            <input 
              {...props}
              type={type} 
              className={`${className}`}
              placeholder={placeholder}
            />
            :
            <input  
              {...props}
              type={type} 
              className={`${className}`}
              placeholder={placeholder}
            />
        }
    </div> 
  )
}

export default InputField