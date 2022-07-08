import Link from 'next/link'
import React from 'react'
import { navItems } from "../../../../helpers"
import { RouteLink } from '../../../../components'

interface subNavItem {
    name: string
    link: string
}

interface CategoryProps {
    name: string;
    link: string
    subNav: subNavItem[] | []
}

export default function Category() {
    const [openSubMenu, setOpenSubMenu] = React.useState(false)
    const [activeItem, setActiveItem] = React.useState('')


    const handleClick = (item: string) => {
        setActiveItem(item)
        setOpenSubMenu(!openSubMenu)
    }




    return (
        <div className='border-2 w-[95%] mt-5 border-[#c5c5c5] shadow-lg bg-none'>
            <div className="title bg-black text-white p-3 border-2">
                <h3 className='font-[600] text-[16px] font-sans'>Category</h3>
            </div>
            <ul>
                {
                    navItems.map((item: CategoryProps, index) => (
                        <RouteLink href={item.link} key={index}>
                            <li className="flex justify-between items-center flex-col first:hidden border-b-[1px] border-[#bdbbbb] text-[#222222] cursor-pointer"
                            >
                                <div className='w-full flex justify-between items-center p-3'
                                   onClick={() => handleClick(item.name)}
                                >
                                    <a className='hover:text-red-color font-bold'>{item.name}</a>
                                    <span className='cursor-pointer'
                                    >
                                        {
                                            openSubMenu && activeItem === item.name ? (
                                                <span>{"-"}</span>
                                            )
                                                : (
                                                    <span>{"+"}</span>
                                                )
                                        }
                                    </span>
                                </div>
                                {/* subnav */}
                                {openSubMenu && activeItem === item.name ? (
                                    <ul className="sub-nav w-full text-left">
                                        {
                                            item.subNav.map((subItem, index2) => (
                                                <li key={index2} className="p-3 border-b-[1px] border-[#bdbbbb] flex items-center first:border-t-[1px] hover:text-red-color hover:font-bold">
                                                    <img 
                                                    src="http://plazathemes.com/demo/carstore/pub/static/frontend/Carstore/carstore4/en_US/images/icon-menu.png" alt="icon" 
                                                    className='mr-3'
                                                    />
                                                    <a>{subItem.name}</a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                ) : ""}
                            </li>
                        </RouteLink>
                    )
                    )
                }
            </ul>
        </div>
    )
}
