import React from 'react'
import Navbar from '../Home/Navbar/Navbar'
import TopNavBar from '../Home/TopNav/TopNavBar'



interface Props  {
    children?: JSX.Element | JSX.Element[];
};
const PageWrapper = ({children }: Props) => {
  return (
    <div>
        <TopNavBar/>
        <Navbar/>
       <main>
         {children}
       </main>
    </div>
  )
}
export default PageWrapper