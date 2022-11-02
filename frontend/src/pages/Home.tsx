import React, { useState } from "react";
import { Link } from "react-router-dom";

import purchase from "../images/purchase.png";
import orderHistory from "../images/orderhistory.png";
import stocks from "../images/stocks.png";
import refund from "../images/refund.png";
import loyalty from "../images/loyalty.png";
import branches from "../images/branches.png";
import employees from "../images/employee.png";
import reporting from "../images/reporting.png";
import admin from "../images/admin.png";

const menus = [
  { menu: "Purchase", image: purchase },
  { menu: "OrderHistory", image: orderHistory },
  { menu: "Stocks", image: stocks },
  { menu: "Refund", image: refund },
  { menu: "Loyalty", image: loyalty },
  { menu: "Branches", image: branches },
  { menu: "Employees", image: employees },
  { menu: "Reporting", image: reporting },
  { menu: "Admin", image: admin },
];

type Props = {};

const Home = (props: Props) => {
  // using this simple state as a placeholder for user authentication
  const [isLoggedIn, logIn] = useState(false);

  return (
    <div className="w-screen">
      <div className="flex justify-center">
        <button
          className={
            "content-center rounded-md p-3 mt-5 " +
            (isLoggedIn ? "bg-green-300" : "bg-red-300")
          }
          onClick={() => logIn(!isLoggedIn)}
        >
          Temp login button
        </button>
      </div>

      {isLoggedIn && (
        <div className="flex flex-wrap justify-center space-x-5 border-2 rounded-lg m-5 p-5 h-100 w-200">
          {/* Page buttons */}
          {/* <div className="border-2 rounded-lg m-5 p-5">
            <div className="flex flex-wrap justify-center space-x-5">
              <Link to="/order" className="bg-blue-500 rounded-md p-5">
                Orders
              </Link>
              <Link to="/pastorders" className="bg-blue-500 rounded-md p-5">
                Order History
              </Link>
              <Link to="/customers" className="bg-blue-500 rounded-md p-5">
                Customer Info
              </Link>
            </div>
          </div> */}
          <div>
            <main>
              <div>
                <div className="columns-3">
                  {menus.map((menu) => (
                    <div>
                      <button className="w-80 h-50 rounded-lg hover:bg-orange-500">
                        <div className="w-60 h-60">
                          {menu.menu}
                          <img className="w-60 h-40" src={menu.image}></img>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
          ;{/* Info panel (you can put store information here) */}
          <div className="border-2 rounded-lg m-5 p-5">
            <div className="flex flex-wrap justify-center space-x-5">
              <div className="p-5 bg-red-100">Store Name</div>
              <div className="p-5 bg-red-100">100%</div>
              <div className="p-5 bg-red-100">250 items</div>
              <div className="p-5 bg-red-100">$500</div>
            </div>
          </div>
        </div>
      )}
      {!isLoggedIn && (
        <div>
          <div className="text-center pt-5">Please log in</div>
        </div>
      )}
    </div>
  );
};

export default Home;
