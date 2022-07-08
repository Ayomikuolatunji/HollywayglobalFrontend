import React from 'react'
import Navbar from './Navbar/Navbar'
import Sidebar from './SideBar/Sidebar'
import TopNavBar from './TopNav/TopNavBar'



interface Props {
  children:JSX.Element | JSX.Element[]
}




const Home = ({
  children
}:Props) => {

  return (
    <div>
        <Sidebar/>
        <main> 
           {children}
        </main>
    </div>
  )
}

export default Home