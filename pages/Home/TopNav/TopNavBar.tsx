import React from 'react'




const TopNavRightBar = () => {
    return (
        <div>
            <div className="header">
                <div className="currency">
                    
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