import Link from "next/link";
import React from "react";
import * as helpers from "../../../helpers";

interface item {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  return (
    <div className="sm:mt-8 lg:w-[70%] mx-auto">
      <nav className="navbar border-b-8 border-red-color flex items-center">
        {helpers.navItems.map((item: item, index) => {
          return (
            <Link key={index} href={item.link} passHref>
              <div className="py-[10px] px-[16px]  bg-black text-white uppercase relative font-[15px] border-r-[1px] border-r-[#fff]block font-normal cursor-pointer hover:bg-red-color">
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
