import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

type Props = {};

const Header = (props: Props) => {
  const location = useLocation();
  const [userToken, setUserToken] = useState<string | undefined>();
  useEffect(() => {
    if (Cookies.get("token") && location.pathname === "/logout") {
      Cookies.remove("token");
    }
  }, [location.pathname]);

  useEffect(() => {
    setUserToken(Cookies.get("token"));
  }, [location.pathname]);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  if (userToken) {
    return (
      <>
        {/* Regular */}
        <header className="p-4 sm:p-6 bg-black hidden md:inline">
          <div className="flex justify-center py-2 md:py-0">
            <Link to="/" className="text-white">
              <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
            </Link>
            <Navbar additionalStyles="flex space-x-4 text-white" />
            <button
              onClick={() => {
                setUserMenu(!userMenu);
              }}
              className="text-white text-lg flex space-x-2 absolute right-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-8 h-8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 0 1 12 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                />
              </svg>
            </button>
            {userMenu && (
              <div className="absolute mt-14 right-5 bg-gray-200 w-40">
                <div className="flex flex-col p-4">
                  <Link
                    to="/logout"
                    className="text-gray-700 text-lg flex space-x-2"
                  >
                    <span>Logout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m17 16 4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile */}
        <header className="p-4 sm:p-6 bg-black md:hidden">
          <div className="flex justify-between py-2 md:py-0">
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
                <Navbar additionalStyles="space-y-4 py-2 bg-gray-200 absolute space-x-4 text-gray-700 w-[120px] mt-8" />
              </div>
            ) : null}
          </div>
        </header>
      </>
    );
  } else {
    return (
      <>
        {/* Regular */}
        <header className="p-4 sm:p-6 bg-black hidden md:inline">
          <div className="flex justify-center items-center py-2 md:py-0">
            <Link
              to="/"
              className="flex self-center text-2xl font-semibold whitespace-nowrap text-white"
            >
              <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
              <span>G9POS</span>
            </Link>
            <Link
              to="login"
              className="text-white text-lg flex space-x-2 absolute right-5"
            >
              <span>Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m11 16-4-4m0 0 4-4m-4 4h14m-5 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1"
                />
              </svg>
            </Link>
          </div>
        </header>

        {/* Mobile */}
        <header className="p-4 sm:p-6 bg-black md:hidden">
          <div className="flex justify-between py-2 md:py-0">
            <Link
              to="/"
              className="flex self-center text-2xl font-semibold whitespace-nowrap text-white"
            >
              <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
              <span>G9POS</span>
            </Link>
            <Link to="login" className="text-white text-lg flex space-x-2">
              <span>Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m11 16-4-4m0 0 4-4m-4 4h14m-5 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1"
                />
              </svg>
            </Link>
          </div>
        </header>
      </>
    );
  }
};

export default Header;
