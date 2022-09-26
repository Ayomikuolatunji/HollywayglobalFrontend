import React from "react";
import {
  AiOutlineMail,
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineWhatsApp,
} from "react-icons/ai";

export default function TopNavBar() {
  return (
    <div className="p-4 bg-gray-200 w-full">
      <div className="md:w-[70%] mx-auto flex justify-between">
        <div className="left">
          <ul className="flex space-x-2">
            <li className="flex items-center border-r-2 border-r-gray-500 px-3 space-x-1">
              <AiOutlineMail />
              <span>hello@colorlib.com</span>
            </li>
            <li className="">
              <span>Free Shipping for all Order of $99</span>
            </li>
          </ul>
        </div>
        <div className="right">
          <div className="icons flex space-x-3">
            <AiFillFacebook />
            <AiOutlineTwitter />
            <AiFillLinkedin />
            <AiOutlineWhatsApp />
          </div>
          <div className="login"></div>
        </div>
      </div>
    </div>
  );
}
