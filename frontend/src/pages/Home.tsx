import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  // using this simple state as a placeholder for user authentication
  const [isLoggedIn, logIn] = useState(false);

  return (
    <div className="w-screen">
      <div className="flex justify-center">
        <button className={"content-center rounded-md p-3 mt-5 " + (isLoggedIn ? "bg-green-300" : "bg-red-300")} onClick={() => logIn(!isLoggedIn)}>
          Temp login button
        </button>
      </div>

      { isLoggedIn &&
        <div>
          <div className="text-center pt-5">Home page</div>

          {/* Page buttons */}
          <div className="border-2 rounded-lg m-5 p-5">
            <div className="flex flex-wrap justify-center space-x-5">
              <Link to="/order" className="bg-blue-500 rounded-md p-5">
                Orders
              </Link>
              <Link to="/pastorders" className="bg-blue-500 rounded-md p-5">
                Order History
              </Link>
              <Link to="/customers" className="bg-blue-500 rounded-md p-5">
                Customer Info
              </Link>
            </div>
          </div>

          {/* Info panel (you can put store information here) */}
          <div className="border-2 rounded-lg m-5 p-5">
            <div className="flex flex-wrap justify-center space-x-5">
            <div className="p-5 bg-red-100">Store Name</div>
              <div className="p-5 bg-red-100">100%</div>
              <div className="p-5 bg-red-100">250 items</div>
              <div className="p-5 bg-red-100">$500</div>
            </div>
          </div>
        </div>
      }
      { !isLoggedIn && 
        <div>
          <div className="text-center pt-5">Please log in</div>
        </div>
      }
    </div>
  );
};

export default Home;
