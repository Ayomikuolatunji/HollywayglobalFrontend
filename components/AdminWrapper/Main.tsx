import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import AdminSidebar from './AdminSidebar'
import Cookies from '../../helpers/Cookies'
import Header from './Header'



interface Props {
  children:JSX.Element | JSX.Element[]
}



const AdminWrapper = ({
  children
}:Props) => {
    const router = useRouter()
    useEffect(() => {
      if (!Cookies.get("admin_token")) {
          router.push("/admin-login")
      }
    }, [router]);
  



  return (
    <div className='flex bg-white h-[100vh]'>
        <div className='w-[15%] bg-[white] h-[100vh]'>
           <AdminSidebar/>
        </div>
        <main className='w-[85%] bg-[white] h-[100vh] overflow-scroll'> 
           <Header/>
           {children}
        </main>
    </div>
  )
}

export default AdminWrapper