import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from '../../helpers/Cookies'
import Sidebar from './SideBar/Sidebar'


interface Props {
  children:JSX.Element | JSX.Element[]
}

const PageWrapper = ({
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
           <Sidebar/>
        </div>
        <main className='w-[80%] bg-[white]'> 
           {children}
        </main>
    </div>
  )
}

export default PageWrapper