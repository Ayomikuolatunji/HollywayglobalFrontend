import Link from 'next/link'
import React from 'react'
import { navItems } from "../../../../helpers"

export default function Category() {
    return (
        <div className='border-8 w-[95%] mt-5 border-white shadow-lg'>
            <div className="title bg-black text-white p-3 border-2">
                <h3 className='font-[600] text-[16px] font-sans'>Category</h3>
            </div>
            <ul>
                {
                    navItems.map((item, index) => (
                        <Link href={item.link}>
                            <li key={index} className="flex justify-between items-center first:hidden p-3 border-[1px] border-[#bdbbbb]">
                                <a>{item.name}</a>
                                <span>
                                    {item.openIcon}
                                </span>
                            </li>
                        </Link>
                    )
                    )
                }
            </ul>
        </div>
    )
}
