import React, { useState, useReducer } from "react";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import Message from "../components/Message";
import Cookies from "js-cookie";
import ProductItem from "../components/ProductItem";
import ModalButtons from "../components/ModalButtons";

const GET_PAST_ORDERS = gql`
  query ($userToken: String!) {
    customerOrder(userToken: $userToken)
    product(userToken: $userToken)
    customer(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
  }
`;

const CUSTOMER_ORDER_MUTATION = gql`
  mutation CustomerOrderMutation(
    $action: String!
    $orderId: Int!
    $customerData: GenericScalar!
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

type Props = {};

const PastCustomerOrders = (props: Props) => {
  const userToken = Cookies.get("token");

  const [result, reexecuteQuery] = useQuery({
    query: GET_PAST_ORDERS,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [customerResult, customerMutation] = useMutation(
    CUSTOMER_ORDER_MUTATION
  );

  const [openEditor, setOpenEditor] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const reducer = (state: any, newState: any) => ({ ...state, ...newState });

  const messageState = {
    message: "",
    errors: false,
    confirmation: false,
  };
  const [message, setMessage] = useReducer(reducer, messageState);

  const customerState = {
    id: 0,
    customer: {},
    items: [],
    userToken: userToken,
  };
  const [initialCustomer, setInitialCustomer] = useReducer(
    reducer,
    customerState
  );
  const [customer, setCustomer] = useReducer(reducer, customerState);

  if (!userToken) {
    return <Error message="401 - Unauthorized access to inventory" />;
  }

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const updateOrder = async () => {
    let editResult = await customerMutation({
      action: "update",
      orderId: customer.id,
      items: customer.items,
      originalItems: initialCustomer.items,
      customerData: customer.customer,
      userToken: customer.userToken,
    });
    if (editResult?.data?.customerOrderMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setInitialCustomer(customerState);
      setCustomer(customerState);
      setMessage({
        message: "Updated order",
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

    setOpenEditor(false);
  };

  const deleteOrder = async () => {
    if (window.confirm("do you want to delete?")) {
      let deleteResult = await customerMutation({
        action: "delete",
        orderId: initialCustomer.id,
        items: initialCustomer.items,
        originalItems: initialCustomer.items,
        customerData: initialCustomer.customer,
        userToken: initialCustomer.userToken,
      });

      if (deleteResult?.data?.customerOrderMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setInitialCustomer(customerState);
        setCustomer(customerState);
        setMessage({
          message: "Deleted customer order",
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
    }

    setOpenEditor(false);
  };

  const addItem = (item: any) => {
    const index = customer.items.findIndex(
      (customerItem: any) =>
        customerItem.name === item.name && customerItem.brand === item.brand
    );
    if (index > -1) {
      setCustomer({
        items: customer.items.filter(
          (customerItem: any) =>
            customerItem.name !== item.name && customerItem.brand !== item.brand
        ),
      });
    } else {
      setCustomer({ items: [...customer.items, item] });
    }
  };

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen overflow-x-auto">
      {openEditor && (
        <Modal title="Edit Order" setCloseModal={setOpenEditor}>
          <div className="sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6 overflow-y-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  // setCustomer(customerState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Customer</span>
                  <select
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    onChange={(e) => {
                      let customerData = data.customer.find(
                        (cust: any) => cust.name === e.target.value
                      );
                      if (customerData) {
                        setCustomer({
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
                    value={customer.customer.name}
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
                <div className="flex justify-center items-center">
                  <span className="mr-16">Items</span>
                  <div className="bg-white flex flex-col space-y-2 overflow-y-auto w-full">
                    {data.product.map((item: any, index: number) => {
                      let selected =
                        customer.items.findIndex(
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
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateOrder}
              firstButtonText="Save"
              firstDisabled={customer.items.length === 0}
              secondButtonClick={deleteOrder}
              secondButtonText="Delete"
              thirdButtonClick={() => {
                setOpenEditor(false);
              }}
              thirdButtonText="Cancel"
            />
          </div>
        </Modal>
      )}
      <table className="w-full text-center">
        <thead className="bg-gray-300 border-b border-gray-700">
          <tr>
            <th className="py-3 px-6">ID</th>
            <th className="py-3 px-6">Customer</th>
            <th className="py-3 px-6">Items</th>
            <th className="py-3 px-6">Date Purchased</th>
            <th className="py-3 px-6">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.customerOrder.map((co: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                setInitialCustomer({
                  id: co.id,
                  customer: co.customer,
                  items: co.items,
                  datePurchased: co.date_purchased,
                  totalCost: co.total_cost,
                });
                setCustomer({
                  id: co.id,
                  customer: co.customer,
                  items: co.items,
                  datePurchased: co.date_purchased,
                  totalCost: co.total_cost,
                });
                setOpenEditor(true);
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{co.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                {co?.customer?.name}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex flex-col">
                  {co.items.map((item: any, itemIndex: number) => (
                    <span key={itemIndex}>
                      {item.name} - {item.brand}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                {co.date_purchased}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">{co.total_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default PastCustomerOrders;
