import React from 'react'
import * as UI from "../../../components"



const TopNavRightBar = () => {
    return (
        <div>
            <div className="header">
                <div className="currency">
                     <UI.DropDown 
                        
                     />
                </div>
            </div>
        </div>
    )
}


const TopNavBar = () => {
  return (
    <div className='flex justify-between items-center'>
        {/* logo */}
        <div className="logo">
            <img src="/assets/logo.png" alt="logo" />
        </div>
        {/* topNavRightBar */}
        <TopNavRightBar />
    </div>
  )
}

export default TopNavBar