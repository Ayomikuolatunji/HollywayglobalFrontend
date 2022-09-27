import React from 'react'
import TopNavBar from './TopNav/TopNavBar'



interface Props  {
    children?: JSX.Element | JSX.Element[];
};
const HeaderWrapper = ({children }: Props) => {
  return (
    <div>
        <TopNavBar/>
       <main>
         {children}
       </main>
    </div>
  )
}
export default HeaderWrapper