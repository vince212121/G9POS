import React from "react";

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

/*
  SVG icons:
    https://heroicons.dev/
  SVG cleaner:
    https://jakearchibald.github.io/svgomg/
  tailwindcss:
    https://tailwindcss.com/
*/

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* TODO: Create the other routes for the pages */}

        <Route path="/order" element={<Order />} />
        <Route path="/customer_order" element={<CreateCustomerOrder />} />
        <Route path="/past_customer_orders" element={<PastCustomerOrders />} />
        <Route path="/vendor_order" element={<CreateVendorOrder />} />
        <Route path="/past_vendor_orders" element={<PastVendorOrders />} />

        <Route path="/customers" element={<Customers />} />
        <Route path="/vendors" element={<Vendors />} />
      </Route>
    </Routes>
  );
};

export default App;
