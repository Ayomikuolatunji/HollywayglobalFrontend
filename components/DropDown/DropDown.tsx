import React from 'react'

interface DropDownProps {
    apperance: boolean;
    className: string;
}

const DropDown = (
    {
        apperance,
        className
    }: DropDownProps
) => {
  return (
    <div>
        {apperance ? 
        <select className={`appearance-none ${className}`}>
            <option>Yes</option>
            <option>No</option>
            <option>Maybe</option>
        </select>
         : 
         <select>
            <option>Yes</option>
            <option>No</option>
            <option>Maybe</option>
         </select>  
         }
    </div>
  )
}

export default DropDown