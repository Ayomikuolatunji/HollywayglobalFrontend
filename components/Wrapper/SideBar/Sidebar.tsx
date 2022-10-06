import React from "react";
import { Popover } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { productsDepartments } from "../../../helpers/utils";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="w-full">
        <h1 className="text-3xl text-start mt-4 text-[#7fad39] font-bold">
          HollywayGlobal
        </h1>
      </div>
      <Popover className="mt-10 w-full">
        {({ open }) => (
          <>
            <Popover.Button className="flex items-center space-x-4 py-3 px-5 bg-[#7fad39] outline-none text-white font-bold hover:border-0 hover:outline-0 w-full">
              <GiHamburgerMenu className="ml-3" />
              <span className="text-lg">All Departments</span>
              <BsChevronDown className={`text-white ml-4`} />
            </Popover.Button>
            <Popover.Panel
              static
              className="flex flex-col space-y-5 border-2 px-5 py-3"
            >
              {productsDepartments.map((item, index) => {
                return (
                  <Link href={item.link} passHref key={index}>
                    <span className="cursor-pointer block text-[#1c1c1c] leading-[24px]">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
