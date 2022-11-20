import React, { useReducer, useState } from "react";
import Cookies from "js-cookie";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Message from "../components/Message";
import ProductItem from "../components/ProductItem";

type Props = {};

const GET_PAGE_DATA = gql`
  query ($userToken: String!) {
    vendor(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
    product(userToken: $userToken)
  }
`;

const VENDOR_ORDER_MUTATION = gql`
  mutation VendorOrderMutation(
    $action: String!
    $vendorData: GenericScalar!
    $items: GenericScalar!
    $originalItems: GenericScalar!
    $quantityOrdered: Int!
    $userToken: String!
  ) {
    vendorOrderMutation(
      action: $action
      vendorData: $vendorData
      items: $items
      originalItems: $originalItems
      quantityOrdered: $quantityOrdered
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

const CreateVendorOrder = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [vendorResult, vendorMutation] = useMutation(VENDOR_ORDER_MUTATION);

  const [showMessage, setShowMessage] = useState(false);

  const reducer = (state: any, newState: any) => ({ ...state, ...newState });

  const messageState = {
    message: "",
    errors: false,
    confirmation: false,
  };
  const [message, setMessage] = useReducer(reducer, messageState);

  const vendorState = {
    vendor: {},
    items: [],
    userToken: userToken,
    quantityOrdered: 0,
    total: 0.0,
  };
  const [vendorOrder, setVendorOrder] = useReducer(reducer, vendorState);

  if (!userToken)
    return <Error message="401 - Unauthorized access to vendor orders" />;

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createOrder = async () => {
    let addResult = await vendorMutation({
      action: "add",
      vendorData: vendorOrder.vendor,
      items: vendorOrder.items,
      originalItems: vendorOrder.items,
      quantityOrdered: vendorOrder.quantityOrdered,
      userToken: vendorOrder.userToken,
    });
    if (addResult?.data?.vendorOrderMutation?.ok) {
      setVendorOrder(vendorState);
      setMessage({
        message: "Created Order",
        error: false,
        confirmation: true,
      });
      setShowMessage(true);
    } else {
      setMessage({
        message: "Something went wrong",
        error: true,
        confirmation: false,
      });
      setShowMessage(true);
    }
  };

  const addItem = (item: any) => {
    const index = vendorOrder.items.findIndex(
      (customerItem: any) =>
        customerItem.name === item.name && customerItem.brand === item.brand
    );
    if (index > -1) {
      setVendorOrder({
        items: vendorOrder.items.filter(
          (customerItem: any) =>
            customerItem.name !== item.name && customerItem.brand !== item.brand
        ),
        total: vendorOrder.total - item.price * vendorOrder.quantityOrdered,
      });
    } else {
      setVendorOrder({
        items: [...vendorOrder.items, item],
        total: vendorOrder.total + item.price * vendorOrder.quantityOrdered,
      });
    }
  };

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen flex justify-center">
      <form
        className="flex flex-col w-full mx-6 lg:mx-0 lg:w-1/3 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h2 className="text-xl font-semibold">Create Vendor Order</h2>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Vendor *</span>
          <select
            className="p-2 border-b border-gray-700 bg-white w-full"
            onChange={(e) => {
              let vendorData = data.vendor.find(
                (ven: any) => ven.name === e.target.value
              );
              if (vendorData) {
                setVendorOrder({
                  vendor: vendorData,
                });
              } else {
                setMessage({
                  message: "Vendor not found",
                  error: true,
                  confirmation: false,
                });
                setShowMessage(true);
              }
            }}
            value={vendorOrder.vendor.name ?? ""}
          >
            <option disabled value="">
              select an option
            </option>
            {data.vendor.map((ven: any, i: number) => (
              <option key={`opt_${i}`} value={ven.name}>
                {ven.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Items *</span>
          <div className="bg-white flex flex-col space-y-2 overflow-y-auto w-full">
            {data.product.map((item: any, index: number) => {
              let selected =
                vendorOrder.items.findIndex(
                  (vendorItem: any) => vendorItem.name === item.name
                ) > -1;
              return (
                <ProductItem
                  key={index}
                  selected={selected}
                  item={item}
                  clickItem={addItem}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Quantity Ordered *</span>
          <input
            type="number"
            name="quantity_ordered"
            placeholder="Quantity Ordered"
            className="p-2 border-b border-gray-700 bg-white w-full"
            value={
              vendorOrder.quantityOrdered > 0 ? vendorOrder.quantityOrdered : 0
            }
            onChange={(e) => {
              const quantity =
                e.target.value === "" ? 0 : parseInt(e.target.value);
              if (quantity > 0) {
                let itemTotal = 0;
                for (let i = 0; i < vendorOrder.items.length; i++)
                  itemTotal = vendorOrder.items[i].price;

                setVendorOrder({
                  quantityOrdered: quantity,
                  total: quantity * itemTotal,
                });
              }
            }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className="space-y-2 flex flex-col justify-center items-end">
          <span className="text-base">
            Sub-total:{" "}
            {parseFloat(vendorOrder.total).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="text-base">
            Tax (13%):{" "}
            {(vendorOrder.total * 0.13).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="text-base">
            Total:{" "}
            {(vendorOrder.total * 1.13).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <button
          type="submit"
          className={` ${
            vendorOrder.total === 0 ||
            !vendorOrder.vendor?.name ||
            vendorOrder.items.length === 0
              ? "cursor-not-allowed"
              : "hover:bg-gray-900"
          }
          text-white font-semibold bg-gray-700  focus:ring-0 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center`}
          onClick={() => {
            createOrder();
          }}
          disabled={
            vendorOrder.total === 0 ||
            !vendorOrder.vendor?.name ||
            vendorOrder.items.length === 0
          }
        >
          Create Order
        </button>
      </form>
      <Message
        message={message.message}
        showMessage={showMessage}
        setMessage={setShowMessage}
        confirmation={message.confirmation}
        error={message.error}
      />
    </div>
  );
};

export default CreateVendorOrder;
