import Link from "next/link";
import React from "react";
// import component 👇
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
import * as helpers from "../../../helpers";

interface item {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <div className="sm:mt-8 lg:w-[70%] mx-auto">
      <button onClick={toggleDrawer}>Show</button>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="bla bla bla"
      >
        <div>Hello World</div>
      </Drawer>
    </div>
  );
};

export default Navbar;
