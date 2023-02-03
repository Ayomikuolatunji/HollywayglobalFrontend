import React from "react";
import { RiGroupFill } from "react-icons/ri";
import { AiFillTags } from "react-icons/ai";
import { FaMoneyBill, FaUsers } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import Logout from "../Logout/Logout";

export const sideBarItems = [
  {
    name: "Dashboard",
    icon: <MdDashboard className="text-xl text-main-color" />,
    path: "/admin-dashboard",
  },
  {
    name: "Products",
    icon: <RiGroupFill className="text-xl text-main-color" />,
    path: "/admin-dashboard/products",
  },
  {
    name: "Departments",
    icon: <AiFillTags className="text-xl text-main-color" />,
    path: "/admin-dashboard/departments",
  },
  {
    name: "Orders",
    icon: <AiOutlineShoppingCart className="text-xl text-main-color" />,
    path: "/admin-dashboard/orders",
  },
  {
    name: "Users",
    icon: <FaUsers className="text-xl text-main-color" />,
    path: "/admin-dashboard/users",
  },
  {
    name: "Transactions",
    icon: <FaMoneyBill className="text-xl text-main-color" />,
    path: "/admin-dashboard/transactions",
  },
];

function AdminSidebar() {
  return (
    <div className="w-full h-[100vh] bg-[#FFFFFF] shadow-sidebar-Shadow border-r-gray-100 border-r-4 sticky top-0 left-0 bottom-0">
      <div className="logo p-4 flex justify-center">
        <img src="/assets/logo.png" alt="logo" />
      </div>
      {/* sidebar items */}
      <div className="sidebar-items flex justify-center flex-col mt-2">
        <ul className="flex justify-start flex-col">
          {sideBarItems.map((item, index) => {
            return (
              <Link href={item.path} key={index}>
                <li
                  className="flex items-center  mt-3 text-base font-normal  dark:text-white hover:bg-[#F2FAFF]  cursor-pointer 
                border-b-2 p-3"
                >
                  <span>{item.icon}</span>
                  <span className="sidebar-item-name p-2 text-xl">
                    {item.name}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
        <div>
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
