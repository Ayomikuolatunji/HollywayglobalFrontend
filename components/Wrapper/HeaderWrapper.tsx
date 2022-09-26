import React from 'react'
import Navbar from './Navbar/Navbar'
import TopNavBar from './TopNav/TopNavBar'



interface Props  {
    children?: JSX.Element | JSX.Element[];
};
const HeaderWrapper = ({children }: Props) => {
  return (
    <div>
        <TopNavBar/>
        {/* <Navbar/> */}
       <main>
         {children}
       </main>
    </div>
  )
}
export default HeaderWrapper