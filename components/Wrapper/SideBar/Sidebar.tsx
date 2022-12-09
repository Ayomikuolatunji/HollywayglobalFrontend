import React, { useEffect, useState } from "react";
import { Menu } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { productsDepartments } from "../../../helpers/utils";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [openCategory, setOpenCategory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/") setOpenCategory(true);
    else setOpenCategory(false);
  }, [router]);

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Menu>
        <div className="relative z-50 w-full">
          <Menu.Button className="flex items-center space-x-4 py-3 px-5 bg-[#7fad39] outline-none text-white font-bold hover:border-0 hover:outline-0 w-full box-border relative">
            <GiHamburgerMenu className="ml-2" />
            <span className="text-md">All Departments</span>
            <BsChevronDown className={`text-white ml-4`} />
          </Menu.Button>
          <Menu.Items
            static={openCategory}
            className="flex flex-col space-y-3.5 border-2 px-5 py-3 w-full box-border absolute left-0 right-0 bg-white"
          >
            {productsDepartments.map((item, index) => {
              return (
                <Menu.Item>
                  <Link href={item.link} passHref key={index}>
                    <span className="cursor-pointer block text-[#1c1c1c] leading-[24px]">
                      {item.name}
                    </span>
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </div>
      </Menu>
    </div>
  );
}
