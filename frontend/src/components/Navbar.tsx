import MenuItems from "./MenuItems";

type Props = {
  additionalStyles?: string;
};

// TODO: Add more routes as needed
const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Inventory",
    url: "/inventory",
    submenu: [
      {
        title: "Order",
        url: "order",
      },
    ],
  },
  {
    title: "Past Orders",
    url: "/past-orders",
    submenu: [
      {
        title: "Customers",
        url: "customers",
      },
      {
        title: "Vendors",
        url: "vendors",
      },
    ],
  },
];

const Navbar = ({ additionalStyles }: Props) => {
  return (
    <nav>
      <ul className={`${additionalStyles}`}>
        {menuItems.map((menu, index) => {
          return <MenuItems item={menu} index={index} />;
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
