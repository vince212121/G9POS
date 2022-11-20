import React from "react";
import { useNavigate } from "react-router-dom";

import { SliderData } from "../assets/data";
import ImageSlider from "../components/ImageSlider";

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
      <div className="flex flex-wrap justify-center space-x-5 border-2 rounded-lg m-5 p-5">
        <div>
          <main>
            <div className="">
              <div className="flex flex-col items-center justify-center md:columns-3 md:block">
                {menus.map((menu) => (
                  <button
                    className="lg:w-80 lg:h-50 rounded-lg hover:bg-orange-500 flex flex-col justify-center items-center p-4"
                    onClick={() => navigate(menu.link)}
                    key={menu.menu}
                  >
                    {/* <div className="w-60 h-60 ml-10">

                    </div> */}
                    {menu.menu}
                    <img
                      className="w-20 h-20 md:w-40 md:h-40"
                      alt={menu.menu}
                      src={menu.image}
                    />
                  </button>
                ))}
              </div>
            </div>
          </main>
          {/* Info panel (you can put store information here) */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-5 border-2 rounded-lg m-5 p-5">
            <span className="p-5 bg-red-100">Store Name</span>
            <span className="p-5 bg-red-100">100%</span>
            <span className="p-5 bg-red-100">250 items</span>
            <span className="p-5 bg-red-100">$500</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
