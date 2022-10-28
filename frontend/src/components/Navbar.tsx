import MenuItems from "./MenuItems";
import { menuItems } from "../assets/menuitems";

type Props = {
  additionalStyles?: string;
};

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
