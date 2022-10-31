import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

type Props = {};

const Header = (props: Props) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    // <header className="flex items-center justify-center py-5 border-b">
    <>
      {/* Regular */}
      <header className="p-4 sm:p-6 bg-black hidden md:inline">
        <div className="flex justify-center py-2 md:py-0">
          {/* <div className="md:flex justify-between md:justify-center"> */}
          <Link to="/" className="text-white">
            <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
          </Link>
          <Navbar additionalStyles="flex space-x-4 text-white" />
        </div>
      </header>

      {/* Mobile */}
      <header className="p-4 sm:p-6 bg-black md:hidden">
        <div className="flex justify-between py-2 md:py-0">
          {/* <div className="md:flex justify-between md:justify-center"> */}
          <Link
            to="/"
            className="flex self-center text-2xl font-semibold whitespace-nowrap text-white"
          >
            <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
            <span>G9POS</span>
          </Link>
          <button
            onClick={() => {
              setMobileMenu(!mobileMenu);
            }}
            className={`${mobileMenu ? "hidden" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {mobileMenu ? (
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setMobileMenu(!mobileMenu);
                }}
                className={`${mobileMenu ? "" : "hidden"} ml-20`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="white"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Navbar additionalStyles="flex flex-col space-x-4 text-white" />
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
};

export default Header;
