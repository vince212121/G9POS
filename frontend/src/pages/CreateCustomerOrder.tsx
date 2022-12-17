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
    customer(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
    product(userToken: $userToken)
  }
`;

const CUSTOMER_ORDER_MUTATION = gql`
  mutation CustomerOrderMutation(
    $action: String!
    $orderId: Int
    $customerData: GenericScalar
    $items: GenericScalar!
    $originalItems: GenericScalar!
    $userToken: String!
  ) {
    customerOrderMutation(
      action: $action
      orderId: $orderId
      customerData: $customerData
      items: $items
      originalItems: $originalItems
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

const CreateCustomerOrder = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [customerResult, customerMutation] = useMutation(
    CUSTOMER_ORDER_MUTATION
  );

  const [showMessage, setShowMessage] = useState(false);

  const reducer = (state: any, newState: any) => ({ ...state, ...newState });

  const messageState = {
    message: "",
    errors: false,
    confirmation: false,
  };
  const [message, setMessage] = useReducer(reducer, messageState);

  const customerState = {
    customer: null,
    items: [],
    userToken: userToken,
    total: 0.0,
  };

  const [customerOrder, setCustomerOrder] = useReducer(reducer, customerState);

  if (!userToken) {
    return <Error message="401 - Unauthorized access to customer orders" />;
  }

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createOrder = async () => {
    let addResult = await customerMutation({
      action: "add",
      items: customerOrder.items,
      originalItems: customerOrder.items,
      customerData: customerOrder?.customer,
      userToken: customerOrder.userToken,
    });
    if (addResult?.data?.customerOrderMutation?.ok) {
      setCustomerOrder(customerState);
      setMessage({
        message: "Created order",
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
    const index = customerOrder.items.findIndex(
      (customerItem: any) =>
        customerItem.name === item.name && customerItem.brand === item.brand
    );

    if (index > -1) {
      setCustomerOrder({
        items: customerOrder.items.splice(index, 1),
        total: customerOrder.total - parseFloat(item.price),
      });
    } else {
      setCustomerOrder({
        items: [...customerOrder.items, item],
        total: customerOrder.total + parseFloat(item.price),
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
        <h2 className="text-xl font-semibold">Create Customer Order</h2>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Customer</span>
          <select
            className="p-2 border-b border-gray-700 bg-white w-full"
            onChange={(e) => {
              let customerData = data.customer.find(
                (cust: any) => cust.name === e.target.value
              );
              if (customerData) {
                setCustomerOrder({
                  customer: customerData,
                });
              } else {
                setMessage({
                  message: "Customer not found",
                  error: true,
                  confirmation: false,
                });
                setShowMessage(true);
              }
            }}
            value={customerOrder?.customer?.name ?? ""}
          >
            <option disabled value="">
              select an option
            </option>
            {data.customer.map((cust: any, i: number) => (
              <option key={`opt_${i}`} value={cust.name}>
                {cust.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Items</span>
          <div className="bg-white flex flex-col space-y-2 overflow-y-auto w-full">
            {data.product.map((item: any, index: number) => {
              let selected =
                customerOrder.items.findIndex(
                  (customerItem: any) => customerItem.name === item.name
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
        <div className="space-y-2 flex flex-col justify-center items-end">
          <span className="text-base">
            Sub-total:{" "}
            {parseFloat(customerOrder.total).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="text-base">
            Tax (13%):{" "}
            {(customerOrder.total * 0.13).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="text-base">
            Total:{" "}
            {(customerOrder.total * 1.13).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <button
          type="submit"
          className={` ${
            customerOrder.items.length === 0
              ? "cursor-not-allowed"
              : "hover:bg-gray-900"
          }
          text-white font-semibold bg-gray-700  focus:ring-0 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center`}
          onClick={() => {
            createOrder();
          }}
          disabled={customerOrder.items.length === 0}
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

export default CreateCustomerOrder;
