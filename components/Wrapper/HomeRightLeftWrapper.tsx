import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from '../../helpers/Cookies'
import Sidebar from './SideBar/Sidebar'
import Navbar from './Navbar/Navbar'
import Carosel from '../../layouts/Home/Carousel/Carousel'



const HomeRightLeftWrapper = () => {

  const router = useRouter()
    useEffect(() => {
      
    }, [router]);
  
  return (
    <div className='flex bg-white w-[100%] mx-auto'>
        <div className='w-[25%] bg-[white]'>
           <Sidebar/>
        </div>
        <main className='w-[80%] bg-[white]'> 
           <Navbar/>
           <Carosel/>
        </main>
    </div>
  )
}

export default HomeRightLeftWrapper