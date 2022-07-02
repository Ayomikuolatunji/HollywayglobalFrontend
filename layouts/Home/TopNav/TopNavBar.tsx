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
        <div className="search border-t-[1px] border-b-[1px] border-[#bbbbbb] flex justify-between mt-4">
            <div className="input-search-btn w-[100%]">
                <UI.InputField
                    type="search"
                    className="bg-white text-sm p-3 border-0 hover:border-0 focus:border-0 hover:outline-none focus:outline-none w-full"
                    placeholder="Search entire store here"
                />
            </div>
            <div className="search-btn">
                <UI.Button
                    text='Search'
                    className="bg-bg-color-main py-2.5 rounded-none cursor-pointer opacity-[1] pl-[20px] pr-[21px] text-white font-serif hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]"
                    disabled={false}
                />
            </div>
        </div>
    )
}

const TopNavRightBar = () => {
    return (
        <div className='w-[60%] border-2 border-[#d7d7d7]'>
            <div className="body flex justify-between p-2">
                <div className="list-items">
                    <ul className="topest--header flex items-center">
                        <li className="currency mr-3">
                            <UI.DropDown
                                apperance={true}
                                className="bg-white text-sm text-[#383838] hover:bg-none rounded-none cursor-pointer"
                                items={[
                                    {text: 'USD', value: 'USD'},
                                    {text: 'EUR', value: 'EUR'},
                                ]}
                                onChange={(value) => console.log(value)}
                                value="USD"
                            />
                        </li>
                        <li className="language mr-3">
                            <UI.DropDown
                                apperance={true}
                                className="bg-white text-sm text-[#383838] hover:bg-none rounded-none cursor-pointer"
                                items={[
                                    {text: 'English', value: 'English'},
                                    {text: 'Deutsch', value: 'Deutsch'},
                                    {text: 'Français', value: 'Français'},
                                ]}
                                onChange={(value) => console.log(value)}
                                value="English"
                            />
                        </li>
                        <li className="welcome-msg mr-3">
                            <UI.Paragraphs
                                text="Welcome to our store"
                                fontSize="text-[16px]"
                                color="text-black font-[300]"
                            />
                        </li>
                    </ul>
                    <ul className="topest--header flex mt-2">
                        <li className="currency">
                            <UI.Paragraphs
                                text="Compare Products"
                                fontSize="text-[13px]"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="language">
                        <UI.Paragraphs
                                text="My Account"
                                fontSize="text-[13px]"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="welcome-msg">
                            <UI.Paragraphs
                                text="My Wish list"
                                fontSize="text-[13px]"
                                color="text-paragraph-color"
                                className='mr-3'
                            />
                        </li>
                        <li className="welcome-msg">
                            <UI.Paragraphs
                                text="Sign In"
                                fontSize="text-[13px]"
                                color="text-paragraph-color"
                            />
                        </li>
                    </ul>
                </div>
                {/* cart */}
                <Cart />
            </div>
            {/* search */}
            <Search />
        </div>
    )
}


const TopNavBar = () => {
  return (
    <div className='flex justify-between'>
        {/* logo */}
        <div className="logo p-2">
            <img src="/assets/logo.png" alt="logo" />
        </div>
        {/* topNavRightBar */}
        <TopNavRightBar />
    </div>
  )
}

export default TopNavBar