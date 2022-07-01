import React from 'react'



interface InputFields{
    type: string
    className?: string

}


const InputField = ({
    type,
    className
}:InputFields) => {


  return (
    <div>
        <input 
        type={type} 
         
        />
    </div>
  )
}

export default InputField