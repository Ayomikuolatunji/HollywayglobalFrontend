import React from "react";
import { BsTelephoneFill } from "react-icons/bs";
import { productsDepartments } from "../../helpers/utils";
import { useGetCartItemsQuery } from "../../redux/apis/usersApis";
import Sidebar from "./SideBar/Sidebar";

export default function NavbarCategory() {
  const { data } = useGetCartItemsQuery() || {};
  return (
    <div className="flex justify-between items-center space-x-16 md:pl-3">
      <div className="w-[25%]">
        <Sidebar />
      </div>
      <div className="border-[1px] outline-0  border-gray-200 w-[65%]">
        <select
          name=""
          id=""
          className="w-[30%] border-0 outline-none  bg-white text-black font-bold py-3"
        >
          <option value="">All Category</option>
          {productsDepartments.map((item, index) => {
            return (
              <option key={index} className="cursor-pointer block text-[#1c1c1c] leading-[24px]">
                {/* <span> */}
                  {item.name}
                {/* </span> */}
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
      <div className="contact flex items-center w-[20%] px-3">
        <span className="p-4 flex justify-center items-center bg-[#f5f5f5] w-[50px] h-[50px] rounded-full text-[#7fad39] mr-5">
          <BsTelephoneFill className="text-xl" />
        </span>
        <div className="support flex flex-col">
          <h1 className="text-black font-extrabold mb-2 text-lg">
            +2349025252652
          </h1>
          <p>support 24/7 time</p>
        </div>
      </div>
    </div>
  );
}
