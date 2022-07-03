import React from 'react'

const Navbar:React.FC = () => {


    const navbarItems=[
        {
            name:"Home",
            link:"/"
        },{
            name:"/Mercedes",
            link:"/mercedes"
        },{
            name:"/bmw",
        },{
            name:"Huyndai",
        }
    ]


  return (
    <div className=''>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>

        </nav>
    </div>
  )



}

export default Navbar