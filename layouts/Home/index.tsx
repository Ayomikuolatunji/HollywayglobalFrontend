import React from 'react'
import Navbar from './Navbar/Navbar'
import TopNavBar from './TopNav/TopNavBar'

const Home:React.FC = () => {
  return (
    <div>
        <TopNavBar/>
        <Navbar/>
    </div>
  )
}

export default Home