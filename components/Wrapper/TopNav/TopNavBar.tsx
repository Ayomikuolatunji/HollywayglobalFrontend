import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import { isAuthenticated } from "../../../helpers";
import Cookies from "../../../helpers/Cookies";
import { localStorageRemoveItem } from "../../../helpers/Storage";
import { useRouter } from "next/router";

export default function TopNavBar() {
  const [islogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (isAuthenticated("user_token")) {
      setIsLogged(true);
    }
  }, []);

  console.log(islogged);

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
            {islogged ? (
              <ProfileDropDown />
            ) : (
              <Link href="/login">
                <li className="flex items-center pl-3 text-[#1c1c1c] cursor-pointer">
                  <FaUserAlt className="mr-2" />
                  Login
                </li>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileDropDown = () => {
  const router = useRouter();
  const logout = () => {
    if (Cookies.get("user_token")) {
      Cookies.remove("user_token");
      localStorageRemoveItem("user_id");
      window.location.reload();
      router.push("/");
    }
  };
  return (
    <div className="group inline-block relative z-50">
      <span className="bg-[#f5f5f5] font-semibold py-2 px-4 rounded inline-flex items-center">
        <span className="mr-1">Dropdown</span>
      </span>
      <ul className="absolute hidden text-gray-700 pt-1 group-hover:block w-full">
        <li className="w-full">
          <Link href={"/profile"}>
            <a className="bg-[#f5f5f5] hover:bg-gray-200 py-2 px-4 block whitespace-no-wrap cursor-pointer">
              Profile
            </a>
          </Link>
        </li>
        <li className="w-full">
          <a
            className="rounded-b bg-[#f5f5f5] hover:bg-gray-200 py-2 px-4 block whitespace-no-wrap cursor-pointer"
            onClick={logout}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};
