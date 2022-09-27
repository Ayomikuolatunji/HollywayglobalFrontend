import React from "react";
import { Popover } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Sidebar() {
  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="w-full">
        <h1 className="text-2xl text-start mt-3 text-[#7fad39] font-bold">
          HollywayGlobal
        </h1>
      </div>
      <Popover className="mt-10 w-full">
        {({ open }) => (
          <>
            <Popover.Button className="flex items-center space-x-4 py-3 px-5 bg-[#7fad39] text-white hover:border-0 hover:outline-0">
              <GiHamburgerMenu />
              <span>All Departments</span>
              <BsChevronDown
                className={`${open ? "rotate-180 transform" : ""}text-white`}
              />
            </Popover.Button>
            <Popover.Panel className="flex flex-col">
              <a href="/insights">Insights</a>
              <a href="/automations">Automations</a>
              <a href="/reports">Reports</a>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
