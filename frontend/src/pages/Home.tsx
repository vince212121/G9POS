import React from "react";
import { useNavigate } from "react-router-dom";

import { SliderData } from "../assets/landingPageItems";
import ImageSlider from "../components/ImageSlider";

import Cookies from "js-cookie";

const menus = [
  { menu: "Purchase", image: "/images/purchase.png", link: "/order" },
  {
    menu: "Create Customer Order",
    image: "/images/cOrder.png",
    link: "/customer_order",
  },
  {
    menu: "Vendor Order History",
    image: "/images/orderhistory.png",
    link: "/past_vendor_orders",
  },
  { menu: "Customers", image: "/images/customers.png", link: "/customers" },
  {
    menu: "Create Vendor Orders",
    image: "/images/vOrder.png",
    link: "/vendor_order",
  },
  { menu: "Inventory", image: "/images/stocks.png", link: "/inventory" },
  { menu: "Vendors", image: "/images/vendors.png", link: "/vendors" },
  {
    menu: "Customer Order History",
    image: "/images/cOrderHistory.png",
    link: "/past_customer_orders",
  },
  { menu: "Admin", image: "/images/admin.png", link: "/" },
];

type Props = {};

const Home = (props: Props) => {
  const userToken = Cookies.get("token");

  const navigate = useNavigate();

  if (!userToken) {
    return (
      <div className="w-screen h-screen md:h-full">
        <ImageSlider slides={SliderData} />
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
