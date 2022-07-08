import React from 'react'
import Sidebar from './SideBar/Sidebar'




interface Props {
  children:JSX.Element | JSX.Element[]
}




const PageWrapper = ({
  children
}:Props) => {

  return (
    <div className='flex bg-white h-[100vh]'>
        <div className='w-[20%]'>
           <Sidebar/>
        </div>
        <main className='w-[80%]'> 
           {children}
        </main>
    </div>
  )
}

export default PageWrapper