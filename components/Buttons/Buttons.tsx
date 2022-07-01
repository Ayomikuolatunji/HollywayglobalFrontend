import React from 'react'



interface ButtonsProps {
    text:string
    className?:string
    disabled?:boolean
}


const Buttons = ({
    text,
    className,
    disabled
}:ButtonsProps) => {



  return (
    <button
      className={`${className}`}
      disabled={disabled}
    >
        {text}
    </button>
  )
}

export default Buttons