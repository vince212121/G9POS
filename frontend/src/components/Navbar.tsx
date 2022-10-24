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
    title: "Orders",
    url: "/orderhome",
    submenu: [
      {
        title: "Create",
        url: "order",
      },
      {
        title: "History",
        url: "pastorders",
      },
    ],
  },
  {
    title: "Misc",
    url: "/misc",
    submenu: [
      {
        title: "Customers",
        url: "customers",
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
