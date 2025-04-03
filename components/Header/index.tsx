// header page
import React from "react";
import { FloatingNav } from "./FloatingNavbar";
import { navItems } from "@/data";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-99999 w-full bg-white shadow-md">
      <FloatingNav navItems={navItems} className="hidden lg:flex" />
    </header>
  );
};

export default Header;
