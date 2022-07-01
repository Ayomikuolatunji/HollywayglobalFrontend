import React from 'react'
import * as UI from "../../../components"




const Cart = () => {
    return (
        <div className="car flex items-center">
            <img src="/assets/icon-cart.png" alt="cart" />
            <div className="cart-count">
                <span>0</span>
            </div>
        </div>         
    )
}


const Search = () => {
    return (
        <div className="search">
            <input type="text" placeholder="Search" />
        </div>
    )
}

const TopNavRightBar = () => {
    return (
        <div className='w-[60%] border-2 border-[#d7d7d7] p-3'>
            <div className="body flex justify-between">
                <div className="list-items">
                    <ul className="topest--header flex items-center">
                        <li className="currency mr-3">
                            <UI.DropDown
                                apperance={true}
                                className="bg-white text-sm"
                                items={[
                                    {text: 'USD', value: 'USD'},
                                    {text: 'EUR', value: 'EUR'},
                                ]}
                            />
                        </li>
                        <li className="language mr-3">
                            <UI.DropDown
                                apperance={true}
                                className="bg-white text-sm p-2"
                                items={[
                                    {text: 'English', value: 'English'},
                                    {text: 'Deutsch', value: 'Deutsch'},
                                    {text: 'Français', value: 'Français'},
                                ]}
                            />
                        </li>
                        <li className="welcome-msg mr-3">
                            <UI.Paragraphs
                                text="Welcome to our store"
                                fontSize="text-[20px]"
                                color="text-black"
                            />
                        </li>
                    </ul>
                    <ul className="topest--header flex mt-3">
                        <li className="currency">
                            <UI.Paragraphs
                                text="Compare Products"
                                fontSize="text-sm"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="language">
                        <UI.Paragraphs
                                text="My Account"
                                fontSize="text-sm"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="welcome-msg">
                            <UI.Paragraphs
                                text="My Wish list"
                                fontSize="text-sm"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="welcome-msg">
                            <UI.Paragraphs
                                text="Sign In"
                                fontSize="text-sm"
                                color="text-paragraph-color"
                            />
                        </li>
                    </ul>
                </div>
                {/* cart */}
                <Cart />
            </div>
            {/* search */}
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