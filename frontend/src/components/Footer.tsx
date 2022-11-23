import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="p-4 sm:p-6 bg-black">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" className="mr-3 h-8" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              G9POS
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-white">
              About G9POS
            </h2>
            <ul className="text-gray-400">
              <li className="mb-4">
                <Link to="/about_us" className="hover:underline">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/our_team" className="hover:underline">
                  Our Team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-white">
              Help & FAQ
            </h2>
            <ul className="text-gray-400">
              <li className="mb-4">
                <Link to="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact_us" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-white">
              Legal
            </h2>
            <ul className="text-gray-400">
              <li className="mb-4">
                <Link to="/privacy_policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms_and_conditions" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
    </footer>
  );
};

export default Footer;
