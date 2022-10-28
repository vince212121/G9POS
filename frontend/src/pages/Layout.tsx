import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      {/* TODO: Add styling to the container */}
      <div className="flex items-center justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
