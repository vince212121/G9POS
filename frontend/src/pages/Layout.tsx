import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div>
      <Header />
      {/* TODO: Add styling to the container */}
      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
