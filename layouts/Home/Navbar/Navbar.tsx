import Link from 'next/link'
import React from 'react'
import * as helpers from "../../../helpers"

interface item{
    name: string,
    link: string
}



const Navbar:React.FC = () => {


  return (
    <div className=''>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
             {
                helpers.navItems.map((item:item, index) => {
                    return <Link className='nav-link' key={index} 
                    href={item.link}>
                        <div>
                            {item.name}
                        </div>
                    </Link>
                 })
             }
        </nav>
    </div>
  )



}

export default Navbar