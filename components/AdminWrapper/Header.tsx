import React from "react";
import { BsFillBellFill } from "react-icons/bs";
import Logout from "../Logout/Logout";

const Header = () => {
  return (
    <div className="flex p-5 bg-[#FFFFFF] border-b-2 w-[100%] border-b-gray-100  justify-between items-center top-0 left-0 right-0 sticky z-[999]">
      <div className="left-content flex items-center">
        <h1 className="text-[#1A1619] text-[24px] font-[700]">
          Admin Dashboard
        </h1>
      </div>
      <div className="flex items-center">
        <BsFillBellFill className="mr-4 text-2xl" />
        {/*logout  */}
        <Logout />
      </div>
    </div>
  );
};

export default Header;
