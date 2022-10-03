import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

type Props = {};

// TODO: Change mobile header to the side
const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-center py-5 border-b">
      <div className="flex space-x-4">
        <Link to="/" className="logo">
          Logo
        </Link>
        <Navbar additionalStyles="flex space-x-4" />
      </div>
    </header>
  );
};

export default Header;
