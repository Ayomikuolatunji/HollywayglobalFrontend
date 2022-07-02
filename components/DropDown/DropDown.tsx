import React from 'react'


interface Item {
    text: string;
    value: string;
}

interface DropDownProps {
    apperance: boolean
    className: string
    items: Item[]
    onChange: (value: string) => void
    value: string
}

const DropDown = (
    {
        apperance,
        className,
        items,
        onChange,
        value
    }: DropDownProps
) => {
  return (
    <div>
        {apperance ? 
            <select className={`appearance-none ${className}`}
                onChange={(e) => onChange(e.target.value)}
                value={value}
            >
                {items.map((item, index) => {  
                    return <option key={index}>{item.text}</option>
                })
                }
            </select>
            : 
            <select className={`${className}`}
                onChange={(e) => onChange(e.target.value)}
                value={value}
            >
            {items.map((item, index) => {  
                    return <option key={index}>{item.text}</option>
                })
                }
            </select>  
         }
    </div>
  )
}

export default DropDown