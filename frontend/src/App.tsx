import React from "react";

import { createClient, Provider, defaultExchanges } from "urql";
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
import Logout from "./pages/Logout";
import Categories from "./pages/Categories";
import AboutUs from "./pages/footer/AboutUs";
import OurTeam from "./pages/footer/OurTeam";
import FAQ from "./pages/footer/FAQ";
import ContactUs from "./pages/footer/ContactUs";
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import TermsAndConditions from "./pages/footer/TermsAndConditions";
import EmailSent from "./pages/footer/EmailSent";

/*
  SVG icons:
    https://heroicons.dev/
  SVG cleaner:
    https://jakearchibald.github.io/svgomg/
  tailwindcss:
    https://tailwindcss.com/
*/

const client = createClient({
  url: BASEURL,
  exchanges: defaultExchanges,
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
          <Route path="/logout" element={<Logout />} />

          <Route path="/vendor_order" element={<CreateVendorOrder />} />
          <Route path="/past_vendor_orders" element={<PastVendorOrders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/categories" element={<Categories />} />

          {/* Footer */}
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/our_team" element={<OurTeam />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact_us" element={<ContactUs />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/terms_and_conditions" element={<TermsAndConditions />} />
          <Route path="/email_sent" element={<EmailSent/>} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;
