export const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Orders",
    submenu: [
      {
        title: "Customer",
        submenu: [
          {
            title: "Order",
            url: "customer_order",
          },
          {
            title: "History",
            url: "past_customer_orders",
          },
        ],
      },
      {
        title: "Vendor",
        submenu: [
          {
            title: "Order",
            url: "vendor_order",
          },
          {
            title: "History",
            url: "past_vendor_orders",
          },
        ],
      },
    ],
  },
  {
    title: "Inventory",
    url: "inventory",
  },
  {
    title: "Misc",
    submenu: [
      {
        title: "Customers",
        url: "customers",
      },
      {
        title: "Vendors",
        url: "vendors",
      },
      {
        title: "Categories",
        url: "categories",
      },
    ],
  },
];
