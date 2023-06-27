import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";
import { BsTelephoneFill } from "react-icons/bs";
import { navItems } from "../../../helpers";
import { productsDepartments } from "../../../helpers/utils";
import { useGetCartItemsQuery } from "../../../redux/apis/usersApis";
import { productsCarts } from "../../../models";

const Navbar: React.FC = () => {
  const { data } = useGetCartItemsQuery() || {};

  return (
    <div className="md:w-[100%] mx-auto lg:pl-3">
      <div className="flex justify-between items-center w-full space-x-16">
        <div className="mb-6 md:w-[25%]">
          <h1 className="text-3xl text-start mt-4 text-[#7fad39] font-bold">
            <Link href="/">HollywayGlobal</Link>
          </h1>
        </div>
        <ul className="py-4 md:w-[65%]">
          {navItems.map((item) => {
            return (
              <Link href={item.link} key={item.link}
               className="text-[#252525] first:text-[#7fad39] 
              font-[700] text-[14px] ml-[60px] first:ml-0 hover:text-[#7fad39] transition-[color] duration-100 delay-100 hover:delay-100"
              >
                  {item.name.toUpperCase()}
              </Link>
            );
          })}
        </ul>
        <div className="flex items-center space-x-6 w-[20%]">
          <div className="relative">
            <span className="absolute top-0 right-0 bg-[#7fad39] text-white rounded-full text-sm w-[15px] h-[15px] flex justify-center items-center text-[10px]">
              0
            </span>
            <AiFillHeart className="text-3xl text-[#1c1c1c]" />
          </div>
          <Link href={"/shopping-carts"}>
            <div className="relative cursor-pointer">
              <span className="absolute top-0 right-0 bg-[#7fad39] text-white rounded-full text-sm w-[15px] h-[15px] flex justify-center items-center text-[11px]">
                {data ? data.cartItems!.length : 0}
              </span>
              <GiShoppingBag className="text-3xl text-[#1c1c1c]" />
            </div>
          </Link>
          <div>
            items:{" "}
            <span className="text-[#1c1c1c] font-extrabold">
              $
              {data && Object.keys(data!).length > 0
                ? data!.totalAmounts
                : "0.00"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
