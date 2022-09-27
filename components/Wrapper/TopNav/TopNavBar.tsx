import React from "react";
import {
  AiOutlineMail,
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

export default function TopNavBar() {
  return (
    <div className="p-4 bg-[#f5f5f5] w-full lg:block hidden">
      <div className="md:w-[70%] mx-auto flex justify-between">
        <div className="left">
          <ul className="flex space-x-2">
            <li className="flex items-center border-r-2 border-r-gray-300 pr-6 space-x-1">
              <MdEmail className="text-black text-xl" />
              <span className="text-[#1c1c1c]">hollywayglobal@gmail.com</span>
            </li>
            <li className="">
              <span className="text-[#1c1c1c] text-[14px] ml-2">
                Free Shipping for all Order of $99
              </span>
            </li>
          </ul>
        </div>
        <div className="right flex space-x-2 items-center">
          <div className="icons flex space-x-5 border-r-2 border-r-gray-300 pr-6">
            <FaFacebookF className="text-black" />
            <AiOutlineTwitter className="text-black" />
            <AiFillLinkedin className="text-black" />
            <AiOutlineWhatsApp className="text-black" />
          </div>
          <div className="login ml-3">
            <li className="flex items-center pl-3 text-[#1c1c1c]">
              <FaUserAlt className="mr-2"/>
              Login
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}
