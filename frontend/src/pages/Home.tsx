import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "urql";

import { SliderData } from "../assets/landingPageItems";
import ImageSlider from "../components/ImageSlider";

import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import ModalButtons from "../components/ModalButtons";

import Cookies from "js-cookie";

const GET_PAGE_DATA = gql`
  query ($userToken: String!) {
    product(userToken: $userToken)
    customerOrder(userToken: $userToken)
    vendorOrder(userToken: $userToken)
    storeName(userToken: $userToken)
  }
`;

const menus = [
  { menu: "Purchase", image: "/images/purchase.png", link: "/order" },
  {
    menu: "Create Customer Order",
    image: "/images/cOrder.png",
    link: "/customer_order",
  },
  {
    menu: "Vendor Order History",
    image: "/images/orderhistory.png",
    link: "/past_vendor_orders",
  },
  { menu: "Customers", image: "/images/customers.png", link: "/customers" },
  {
    menu: "Create Vendor Orders",
    image: "/images/vOrder.png",
    link: "/vendor_order",
  },
  { menu: "Inventory", image: "/images/stocks.png", link: "/inventory" },
  { menu: "Vendors", image: "/images/vendors.png", link: "/vendors" },
  {
    menu: "Customer Order History",
    image: "/images/cOrderHistory.png",
    link: "/past_customer_orders",
  },
  { menu: "Admin", image: "/images/admin.png", link: "/" },
];

type Props = {};

const Home = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const countTotal = useCallback(() => {
    let count = 0;

    if (data != null) {
      if (data.product.length !== 0) {
        data.product.map(
          (temp: { quantity: number }) => (count += temp.quantity)
        );
      }
    }
    return count;
  }, [data]);

  const calculateRevenue = useCallback(() => {
    let customerTotal = 0;
    let vendorTotal = 0;
    let revenue: number = 0;
    if (data != null) {
      if (data.customerOrder.length !== 0) {

        for (let index = 0; index < data.customerOrder.length; index++) {
          customerTotal += parseFloat(data.customerOrder[index].total_cost);
        }
      }
      if (data.vendorOrder.length !== 0)
      {
        for (let index = 0; index < data.vendorOrder.length; index++) {
          vendorTotal += parseFloat(data.vendorOrder[index].total_cost);
        }
      }

      revenue = customerTotal - vendorTotal;
    }
    return revenue;
  }, [data]);

  const calculateTotal = useCallback(() => {
    let total = 0;
    if (data != null) {
      if (data.customerOrder.length !== 0) {
        for (let index = 0; index < data.customerOrder.length; index++) {
          total += parseFloat(data.customerOrder[index].total_cost);
        }
      }
    }
    return total;
  }, [data]);

  useEffect(() => {
    reexecuteQuery({ requestPolicy: "network-only" });
  }, [reexecuteQuery]);

  const navigate = useNavigate();

  const [filterVisible, setFilterVisible] = useState(false);
  const [fItem1, setFItem1] = useState(false);
  const [fItem2, setFItem2] = useState(false);
  const [fItem3, setFItem3] = useState(false);

  if (!userToken) {
    return (
      <div className="w-screen h-screen md:h-full">
        <ImageSlider slides={SliderData} />
      </div>
    );
  }

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createReport = () => {

    setFilterVisible(false);
  };

  // {
  //   /* Create report filter selection modal */
  // }
  // {
  //   filterVisible && (
  //     <Modal title="Create Report" setCloseModal={setFilterVisible}>
  //       <div className="sm:h-[10rem] overflow-y-auto md:h-full">
  //         <div className="p-6 space-y-6 flex flex-col">
  //           <form className="flex flex-col space-y-6 overflow-y-auto">
  //             <div className="space-x-10 flex justify-center items-center">
  //               <div className="flex flex-col">
  //                 <label>
  //                   <input
  //                     type="checkbox"
  //                     id="fItem1"
  //                     checked={fItem1}
  //                     onChange={() => setFItem1(!fItem1)}
  //                   />
  //                   Filter Item 1
  //                 </label>
  //                 <label>
  //                   <input
  //                     type="checkbox"
  //                     id="fItem2"
  //                     checked={fItem2}
  //                     onChange={() => setFItem2(!fItem2)}
  //                   />
  //                   Filter Item 2
  //                 </label>
  //                 <label>
  //                   <input
  //                     type="checkbox"
  //                     id="fItem3"
  //                     checked={fItem3}
  //                     onChange={() => setFItem3(!fItem3)}
  //                   />
  //                   Filter Item 3
  //                 </label>
  //               </div>
  //             </div>
  //           </form>
  //         </div>
  //         {/* Modal footer */}
  //         <ModalButtons
  //           firstButtonClick={createReport}
  //           firstButtonText="Create Report"
  //           secondButtonClick={() => {
  //             setFilterVisible(false);
  //           }}
  //           secondButtonText="Cancel"
  //         />
  //       </div>
  //     </Modal>
  //   );
  // }

  return (
    <div className="w-screen">
      {filterVisible && (
        <Modal title="Create Report" setCloseModal={setFilterVisible}>
          <div className="sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form className="flex flex-col space-y-6 overflow-y-auto">
                <div className="space-x-10 flex justify-center items-center">
                  <div className="flex flex-col">
                    <label>
                      <input
                        type="checkbox"
                        id="fItem1"
                        checked={fItem1}
                        onChange={() => setFItem1(!fItem1)}
                      />
                      Filter Item 1
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        id="fItem2"
                        checked={fItem2}
                        onChange={() => setFItem2(!fItem2)}
                      />
                      Filter Item 2
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        id="fItem3"
                        checked={fItem3}
                        onChange={() => setFItem3(!fItem3)}
                      />
                      Filter Item 3
                    </label>
                  </div>
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={createReport}
              firstButtonText="Create Report"
              secondButtonClick={() => {
                setFilterVisible(false);
              }}
              secondButtonText="Cancel"
            />
          </div>
        </Modal>
      )}
      <div className="flex flex-wrap justify-center space-x-5 border-2 rounded-lg m-5 p-5">
        <div>
          <main>
            <div className="">
              <div className="flex flex-col items-center justify-center md:columns-3 md:block">
                {menus.map((menu) => (
                  <button
                    className="lg:w-80 lg:h-50 rounded-lg hover:bg-orange-500 flex flex-col justify-center items-center p-4"
                    onClick={() => navigate(menu.link)}
                    key={menu.menu}
                  >
                    {menu.menu}
                    <img
                      className="w-20 h-20 md:w-40 md:h-40"
                      alt={menu.menu}
                      src={menu.image}
                    />
                  </button>
                ))}
              </div>
            </div>
          </main>
          {/* Info panel (you can put store information here) */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-5 border-2 rounded-lg m-5 p-5">
            <span className="p-5 bg-red-100">{data.storeName.store}</span>
            <span className="p-5 bg-red-100">{countTotal()} Items</span>
            <span className="p-5 bg-red-100">
              Sales: {calculateTotal().toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
            <span className="p-5 bg-red-100">
              Revenue: {calculateRevenue().toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
            {/*Still needs to be fixed*/}
            <button onClick={() => setFilterVisible(true)}>
              <div className="p-5 bg-gray-700 text-white hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create Report</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
