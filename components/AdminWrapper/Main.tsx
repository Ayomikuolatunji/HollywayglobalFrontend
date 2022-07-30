import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import AdminSidebar from './AdminSidebar'
import Cookies from '../../helpers/Cookies'
import Header from './Header'
import { getAppCredentials } from "../../helpers/Auth";
import { useAuthAdminQuery } from '../../redux/apis/authApi'



interface Props {
  children:JSX.Element | JSX.Element[]
}



const AdminWrapper = ({
  children
}:Props) => {
  const admin_id = getAppCredentials("admin_token")?.admin_id;

  if(admin_id){
    const { data }=useAuthAdminQuery(admin_id)
    console.log(data)
  }


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