import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SliderData } from "../assets/data";
import ImageSlider from "../components/ImageSlider";
import Error from "../components/Error";

import purchase from "../images/purchase.png";
import orderHistoryVendor from "../images/orderhistory.png";
import stocks from "../images/stocks.png";
import cOrder from "../images/cOrder.png";
import orderHistoryCustomer from "../images/cOrderHistory.png";
import vOrder from "../images/vOrder.png";
import customers from "../images/customers.png";
import vendors from "../images/vendors.png";
import admin from "../images/admin.png";
import Cookies from "js-cookie";

const menus = [
  { menu: "Purchase", image: purchase, link: "/order" },
  { menu: "Create Customer Order", image: cOrder, link: "/customer_order" },
  {
    menu: "Vendor Order History",
    image: orderHistoryVendor,
    link: "/past_vendor_orders",
  },
  { menu: "Customers", image: customers, link: "/customers" },
  { menu: "Create Vendor Orders", image: vOrder, link: "/vendor_order" },
  { menu: "Inventory", image: stocks, link: "/inventory" },
  { menu: "Vendors", image: vendors, link: "/vendors" },
  {
    menu: "Customer Order History",
    image: orderHistoryCustomer,
    link: "/past_customer_orders",
  },
  { menu: "Admin", image: admin, link: "/" },
];

type Props = {};

const Home = (props: Props) => {
  const userToken = Cookies.get("token");

  const navigate = useNavigate();

  if (!userToken) {
    return (
      <div className="w-screen h-screen md:h-full">
        <div className="text-center pt-5">Please log in</div>
        <div>
          <ImageSlider slides={SliderData} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen">
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
                    <button
                      className="w-80 h-50 rounded-lg hover:bg-orange-500"
                      onClick={() => navigate(menu.link)}
                    >
                      <div className="w-60 h-60 ml-10">
                        {menu.menu}
                        <img
                          className="w-40 h-40  ml-10"
                          alt={menu.menu}
                          src={menu.image}
                        ></img>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
        {/* Info panel (you can put store information here) */}
        <div className="border-2 rounded-lg m-5 p-5">
          <div className="flex flex-wrap justify-center space-x-5">
            <div className="p-5 bg-red-100">Store Name</div>
            <div className="p-5 bg-red-100">100%</div>
            <div className="p-5 bg-red-100">250 items</div>
            <div className="p-5 bg-red-100">$500</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
