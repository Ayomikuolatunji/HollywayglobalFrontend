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
        <div className='w-[20%] bg-[white]'>
           <AdminSidebar/>
        </div>
        <main className='w-[80%] bg-[white]'> 
           <Header/>
           {children}
        </main>
    </div>
  )
}

export default AdminWrapper