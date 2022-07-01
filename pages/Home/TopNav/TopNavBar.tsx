import React from 'react'
import * as UI from "../../../components"



const TopNavRightBar = () => {
    return (
        <div className='w-[70%] border-2 border-[#d7d7d7]'>
            <ul className="topest--header flex">
                <li className="currency">
                     <UI.DropDown
                        apperance={true}
                        className="bg-white"
                        items={[
                            {text: 'USD', value: 'USD'},
                            {text: 'EUR', value: 'EUR'},
                        ]}
                     />
                </li>
                <li className="language">
                    <UI.DropDown
                        apperance={true}
                        className="bg-white"
                        items={[
                            {text: 'English', value: 'English'},
                            {text: 'Deutsch', value: 'Deutsch'},
                        ]}
                    />
                </li>
                <li className="welcome-msg">
                    <UI.Paragraphs
                        text="Welcome to our store"
                        fontSize="text-sm"
                        color="text-black"
                    />
                </li>
            </ul>
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