import React from 'react'



interface InputFields{
    type: string
    className?: string
    placeholder?: string
}


const InputField = ({
    type,
    className,
    placeholder
}:InputFields) => {


  return (
    <div className=''>
        {
            type ==="search" ?
            <input 
              type={type} 
              className={`${className}`}
              placeholder={placeholder}
            />
            :
            <input  
              type={type} 
              className={`${className}`}
              placeholder={placeholder}
            />
        }
    </div> 
  )
}

export default InputField