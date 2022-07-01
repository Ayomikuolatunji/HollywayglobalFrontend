import React from 'react'
import * as UI from "../../../components"




const Cart = () => {
    return (
        <div className='flex justify-between items-center'>
           {/* cart */}
              <div className="cart">
                    <img src="/assets/cart.png" alt="cart" />
                    <div className="cart-count">
                        <span>0</span>
                    </div>
               </div>         
        </div>
    )
}


const TopNavRightBar = () => {
    return (
        <div className='w-[70%] border-2 border-[#d7d7d7]'>
            <div className="list-items">
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
                                {text: 'Français', value: 'Français'},
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
                <ul className="topest--header flex">
                    <li className="currency">
                        <UI.Paragraphs
                            text="Compare Products"
                            fontSize="text-sm"
                            color="text-black"
                        />
                    </li>
                    <li className="language">
                       <UI.Paragraphs
                            text="My Account"
                            fontSize="text-sm"
                            color="text-black"
                        />
                    </li>
                    <li className="welcome-msg">
                        <UI.Paragraphs
                            text="My Wishlist"
                            fontSize="text-sm"
                            color="text-black"
                        />
                    </li>
                    <li className="welcome-msg">
                        <UI.Paragraphs
                            text="Sign In"
                            fontSize="text-sm"
                            color="text-black"
                        />
                    </li>
                </ul>
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