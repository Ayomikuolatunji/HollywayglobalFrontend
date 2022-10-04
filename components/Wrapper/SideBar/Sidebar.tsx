import React from "react";
import { Popover } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

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
              className="flex flex-col space-y-5 border-2 px-3 py-3"
            >
              <a href="/insights" className="mt-3">
                Insights
              </a>
              <a href="/automations">Automations</a>
              <a href="/reports">Reports</a>
              <a href="/insights">Insights</a>
              <a href="/automations">Automations</a>
              <a href="/reports">Reports</a>
              <a href="/insights">Insights</a>
              <a href="/automations">Automations</a>
              <a href="/reports">Reports</a>
              <a href="/insights">Insights</a>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
