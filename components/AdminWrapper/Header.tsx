import React from "react";
import { BsFillBellFill } from "react-icons/bs";
import Logout from "../../components/logout/Logout";

const Header = () => {
  return (
    <div className="flex p-8 bg-[#FFFFFF] border-b-2 w-[100%] border-b-gray-100  justify-between items-center top-0 left-0 right-0 sticky z-50">
      <div className="left-content flex items-center">
        <h1 className="text-[#1A1619] text-[24px] font-[700]">
          Admin Dashboard
        </h1>
      </div>
      <div className="flex items-center">
        <div className="">
          <BsFillBellFill className="mr-4 text-2xl" />
        </div>
        {/*logout  */}
        <Logout />
      </div>
    </div>
  );
};

export default Header;
