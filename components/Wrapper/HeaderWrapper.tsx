import React from "react";
import Navbar from "./Navbar/Navbar";
import NavbarCategory from "./NavbarCategory";
import TopNavBar from "./TopNav/TopNavBar";

interface Props {
  children?: JSX.Element | JSX.Element[];
}
const HeaderWrapper = ({ children }: Props) => {
  return (
    <div>
      <TopNavBar />
      <div className="header bg-[white] md:max-w-[1270px] mx-auto">
        <Navbar />
        <NavbarCategory />
      </div>
      <main>{children}</main>
    </div>
  );
};
export default HeaderWrapper;
