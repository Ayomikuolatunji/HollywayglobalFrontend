import React from 'react'


interface Item {
    text: string;
    value: string;
}

interface DropDownProps {
    apperance: boolean;
    className: string;
    items: Item[];
}

const DropDown = (
    {
        apperance,
        className,
        items
    }: DropDownProps
) => {
  return (
    <div>
        {apperance ? 
        <select className={`appearance-none ${className}`}>
            {items.map((item, index) => {  
                return <option key={index}>{item.text}</option>
             })
            }
        </select>
         : 
         <select className={`${className}`}>
            <option>Yes</option>
            <option>No</option>
            <option>Maybe</option>
         </select>  
         }
    </div>
  )
}

export default DropDown