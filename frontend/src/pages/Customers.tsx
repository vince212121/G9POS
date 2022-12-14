import React, { useReducer, useState } from "react";
import Cookies from "js-cookie";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Message from "../components/Message";
import Modal from "../components/Modal";
import ModalButtons from "../components/ModalButtons";

type Props = {};

const GET_PAGE_DATA = gql`
  query ($userToken: String!) {
    customer(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
  }
`;

const CUSTOMER_MUTATION = gql`
  mutation CustomerMutation(
    $action: String!
    $email: String!
    $name: String!
    $phone: String
    $customerId: Int
    $userToken: String!
  ) {
    customerMutation(
      action: $action
      email: $email
      name: $name
      phone: $phone
      customerId: $customerId
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

const Customers = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [customerResult, customerMutation] = useMutation(CUSTOMER_MUTATION);

  const [openEditor, setOpenEditor] = useState(false);
  const [openAddModal, setAddModal] = useState(false);
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
    email: "",
    name: "",
    phone: "",
    userToken: userToken,
  };

  const [customer, setCustomer] = useReducer(reducer, customerState);

  if (!userToken)
    return <Error message="401 - Unauthorized access to customers" />;

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createCustomer = async () => {
    let addResult = await customerMutation({
      action: "add",
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      userToken: customer.userToken,
    });
    if (addResult?.data?.customerMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setCustomer(customerState);
      setMessage({
        message: "Created Customer",
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
    setAddModal(false);
  };

  const updateCustomer = async () => {
    let updateResult = await customerMutation({
      action: "update",
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      customerId: customer.id,
      userToken: customer.userToken,
    });
    if (updateResult?.data?.customerMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setCustomer(customerState);
      setMessage({
        message: "Updated Customer",
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

  const deleteCustomer = async () => {
    if (window.confirm("do you want to delete?")) {
      let deleteResult = await customerMutation({
        action: "delete",
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        customerId: customer.id,
        userToken: customer.userToken,
      });
      if (deleteResult?.data?.customerMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setCustomer(customerState);
        setMessage({
          message: "Deleted Customer",
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

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen overflow-x-auto">
      {openEditor && (
        <Modal title="Edit Customer" setCloseModal={setOpenEditor}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setCustomer(customerState);
                }}
              >
                <div className="space-x-11 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.name}
                    onChange={(e) => setCustomer({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Email</span>
                  <input
                    name="email"
                    placeholder="Email"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.email}
                    onChange={(e) => setCustomer({ email: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Phone</span>
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ phone: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateCustomer}
              firstButtonText="Save"
              firstDisabled={customer.name === "" || customer.email === ""}
              secondButtonClick={deleteCustomer}
              secondButtonText="Delete"
              thirdButtonClick={() => {
                setOpenEditor(false);
              }}
              thirdButtonText="Cancel"
            />
          </div>
        </Modal>
      )}
      {openAddModal && (
        <Modal title="Add Customer" setCloseModal={setAddModal}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setCustomer(customerState);
                }}
              >
                <div className="space-x-11 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.name}
                    onChange={(e) => setCustomer({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Email</span>
                  <input
                    name="email"
                    placeholder="Email"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.email}
                    onChange={(e) => setCustomer({ email: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Phone</span>
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ phone: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={createCustomer}
              firstButtonText="Add"
              firstDisabled={customer.email === "" || customer.name === ""}
              thirdButtonClick={() => {
                setAddModal(false);
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
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {data.customer.map((customer: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                if (!openAddModal) {
                  setCustomer({
                    id: parseInt(customer.id),
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phoneNumber,
                  });
                  setOpenEditor(true);
                }
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{customer.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">{customer.name}</td>
              <td className="py-4 px-6 whitespace-nowrap">{customer.email}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                {customer.phoneNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="fixed right-5 bottom-5 z-50 bg-white rounded-3xl"
        onClick={() => {
          if (!openEditor) {
            setCustomer(customerState);
            setAddModal(true);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10 md:w-12 md:h-12"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      </button>
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

export default Customers;
