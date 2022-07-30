import React from "react";
import { RiGroupFill } from "react-icons/ri";
import { AiFillTags } from "react-icons/ai";
import { FaMoneyBill } from "react-icons/fa";
import Link from "next/link";
export var sideBarItems = [
    {
        name: "Dashboard",
        icon: <RiGroupFill className="text-xl"/>,
        path: "/admin-dashboard",
    },
    {
        name: "Products",
        icon: <RiGroupFill className="text-xl"/>,
        path: "/admin-dashboard/products",
    },
    {
        name: "Categories",
        icon: <AiFillTags className="text-xl"/>,
        path: "/admin-dashboard/categories",
    }, {
        name: "Orders",
        icon: <FaMoneyBill className="text-xl"/>,
        path: "/admin-dashboard/orders",
    },
    {
        name: "Users",
        icon: <FaMoneyBill className="text-xl"/>,
        path: "/admin-dashboard/users",
    },
    {
        name: "Transactions",
        icon: <FaMoneyBill className="text-xl"/>,
        path: "/admin-dashboard/transactions",
    },
];
function AdminSidebar() {
    return (<div className="w-full h-[100vh] bg-[#FFFFFF] shadow-sidebar-Shadow border-r-gray-100 border-r-4 sticky top-0 left-0 bottom-0">
      <div className="logo p-4 flex justify-center">
        <img src="/assets/logo.png" alt="logo"/>
      </div>
      {/* sidebar items */}
      <div className="sidebar-items p-4 flex justify-center flex-col mt-10">
        <ul className="w-[80%] mx-auto flex justify-center flex-col">
          {sideBarItems.map(function (item, index) {
            return (<Link href={item.path} key={index}>
                <div className="flex items-center pl-7 p-2 nav-items mt-3 py- ml-3 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-[#F2FAFF] dark:hover:bg-gray-700 cursor-pointer">
                  <span>{item.icon}</span>
                  <span className="sidebar-item-name p-2 text-xl">
                    {item.name}
                  </span>
                </div>
              </Link>);
        })}
        </ul>
      </div>
    </div>);
}
export default AdminSidebar;
//# sourceMappingURL=AdminSidebar.jsx.map