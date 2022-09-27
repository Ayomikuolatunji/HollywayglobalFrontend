import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";

// import component 👇
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
import { navItems } from "../../../helpers";

interface item {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
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
            items: <span className="text-[#1c1c1c] font-extrabold">${"0.00"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
