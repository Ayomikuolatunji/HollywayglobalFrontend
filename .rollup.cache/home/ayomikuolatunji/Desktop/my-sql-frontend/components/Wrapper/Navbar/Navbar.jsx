import Link from "next/link";
import React from "react";
import * as helpers from "../../../helpers";
var Navbar = function () {
    return (<div className="sm:mt-8">
      <nav className="navbar border-b-8 border-red-color flex items-center">
        {helpers.navItems.map(function (item, index) {
            return (<Link key={index} href={item.link} passHref>
              <div className="py-[10px] px-[16px]  bg-black text-white uppercase relative font-[15px] border-r-[1px] border-r-[#fff]block font-normal cursor-pointer hover:bg-red-color">
                {item.name}
              </div>
            </Link>);
        })}
      </nav>
    </div>);
};
export default Navbar;
//# sourceMappingURL=Navbar.jsx.map