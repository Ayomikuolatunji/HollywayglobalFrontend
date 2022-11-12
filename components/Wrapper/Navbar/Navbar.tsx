import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";
import { BsTelephoneFill } from "react-icons/bs";
import { navItems } from "../../../helpers";
import { productsDepartments } from "../../../helpers/utils";
import { useGetCartItemsQuery } from "../../../redux/apis/usersApis";

const Navbar: React.FC = () => {
  const { data } = useGetCartItemsQuery();

  return (
    <div className="lg:w-[100%] mx-auto lg:p-3">
      <div className="flex justify-between items-center">
        <ul className="py-4 flex">
          {navItems.map((item) => {
            return (
              <Link href={item.link}>
                <a
                  className="text-[#252525] first:text-[#7fad39] 
              font-[700] text-[14px] ml-[60px] first:ml-0 hover:text-[#7fad39] transition-[color] duration-100 delay-100 hover:delay-100"
                >
                  {item.name.toUpperCase()}
                </a>
              </Link>
            );
          })}
        </ul>
        <div className="cart-wishlist flex items-center space-x-4">
          <div className="relative">
            <span className="absolute top-0 right-0 bg-[#7fad39] text-white rounded-full text-sm w-[15px] h-[15px] flex justify-center items-center text-[10px]">
              0
            </span>
            <AiFillHeart className="text-3xl text-[#1c1c1c]" />
          </div>
          <div className="relative">
            <span className="absolute top-0 right-0 bg-[#7fad39] text-white rounded-full text-sm w-[15px] h-[15px] flex justify-center items-center text-[11px]">
              0
            </span>
            <GiShoppingBag className="text-3xl text-[#1c1c1c]" />
          </div>
          <div>
            items:{" "}
            <span className="text-[#1c1c1c] font-extrabold">${"0.00"}</span>
          </div>
        </div>
      </div>
      <div className="search relative mt-4 flex justify-between items-center">
        <div className="search-warapper border-[1px] outline-0 border-gray-200 w-[70%]">
          <select
            name=""
            id=""
            className="w-[30%] border-0 outline-none  bg-white text-black font-bold py-3"
          >
            <option value="">All Category</option>
            {productsDepartments.map((item, index) => {
              return (
                <option key={index}>
                  <span className="cursor-pointer block text-[#1c1c1c] leading-[24px]">
                    {item.name}
                  </span>
                </option>
              );
            })}
          </select>
          <input
            type="text"
            placeholder="What do you need?"
            className="border-0 w-[45%] p-3 outline-0"
          />
          <button className="bg-[#7fad39] p-3.5 w-[25%] font-[800] text-white">
            SEARCH
          </button>
        </div>
        <div className="contact flex items-center">
          <span className="p-4 flex justify-center items-center bg-[#f5f5f5] w-[50px] h-[50px] rounded-full text-[#7fad39] mr-5">
            <BsTelephoneFill text-xl />
          </span>
          <div className="support flex flex-col">
            <h1 className="text-black font-extrabold mb-2 text-lg">
              +2349025252652
            </h1>
            <p>support 24/7 time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
