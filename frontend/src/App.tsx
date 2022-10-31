import React from "react";

import { createClient, Provider, defaultExchanges } from "urql";
import Cookies from "js-cookie";
import { BASEURL } from "./assets/constants";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

import Order from "./pages/Order";
import PastCustomerOrders from "./pages/PastCustomerOrders";
import PastVendorOrders from "./pages/PastVendorOrders";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import CreateCustomerOrder from "./pages/CreateCustomerOrder";
import CreateVendorOrder from "./pages/CreateVendorOrder";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

/*
  SVG icons:
    https://heroicons.dev/
  SVG cleaner:
    https://jakearchibald.github.io/svgomg/
  tailwindcss:
    https://tailwindcss.com/
*/

// TODO: need to figure out what is wrong with the authentication for mutations
// To make the query and mutations work, the login required will need to be taken off
const client = createClient({
  url: BASEURL,
  exchanges: defaultExchanges,
  // fetchOptions: () => {
  //   // const token = Cookies.get("token");
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImV4cCI6MTY2NzE0NDUyNCwib3JpZ0lhdCI6MTY2NzE0NDIyNH0.NPZ8WmsmvpTg97HuO5LI6v1wPjETiZXrFnSBxQUYQ8w";
  //   return {
  //     headers: { authorization: token ? `JWT ${token}` : "" },
  //   };
  // },
});

const App = () => {
  return (
    <Provider value={client}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/customer_order" element={<CreateCustomerOrder />} />
          <Route
            path="/past_customer_orders"
            element={<PastCustomerOrders />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          <Route path="/vendor_order" element={<CreateVendorOrder />} />
          <Route path="/past_vendor_orders" element={<PastVendorOrders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vendors" element={<Vendors />} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;
