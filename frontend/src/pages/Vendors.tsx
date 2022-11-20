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
    vendor(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
  }
`;

const VENDOR_MUTATION = gql`
  mutation VendorMutation(
    $action: String!
    $email: String!
    $name: String!
    $phone: String
    $vendorId: Int
    $userToken: String!
  ) {
    vendorMutation(
      action: $action
      email: $email
      name: $name
      phone: $phone
      vendorId: $vendorId
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

const Vendors = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [vendorResult, vendorMutation] = useMutation(VENDOR_MUTATION);

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

  const vendorState = {
    id: 0,
    email: "",
    name: "",
    phone: "",
    userToken: userToken,
  };
  const [vendor, setVendor] = useReducer(reducer, vendorState);

  if (!userToken)
    return <Error message="401 - Unauthorized access to vendors" />;

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createVendor = async () => {
    let addResult = await vendorMutation({
      action: "add",
      email: vendor.email,
      name: vendor.name,
      phone: vendor.phone,
      userToken: vendor.userToken,
    });
    if (addResult?.data?.vendorMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setVendor(vendorState);
      setMessage({
        message: "Created Vendor",
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

  const updateVendor = async () => {
    let updateResult = await vendorMutation({
      action: "update",
      email: vendor.email,
      name: vendor.name,
      phone: vendor.phone,
      vendorId: vendor.id,
      userToken: vendor.userToken,
    });
    if (updateResult?.data?.vendorMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setVendor(vendorState);
      setMessage({
        message: "Updated Vendor",
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

  const deleteVendor = async () => {
    if (window.confirm("do you want to delete?")) {
      let deleteResult = await vendorMutation({
        action: "delete",
        email: vendor.email,
        name: vendor.name,
        phone: vendor.phone,
        vendorId: vendor.id,
        userToken: vendor.userToken,
      });
      if (deleteResult?.data?.vendorMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setVendor(vendorState);
        setMessage({
          message: "Deleted Vendor",
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
        <Modal title="Edit Vendor" setCloseModal={setOpenEditor}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setVendor(vendorState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.name}
                    onChange={(e) => setVendor({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Email</span>
                  <input
                    name="email"
                    placeholder="Email"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.email}
                    onChange={(e) => setVendor({ email: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Phone</span>
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.phone}
                    onChange={(e) => setVendor({ phone: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateVendor}
              firstButtonText="Save"
              firstDisabled={vendor.name === "" || vendor.email === ""}
              secondButtonClick={deleteVendor}
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
        <Modal title="Add Vendor" setCloseModal={setAddModal}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setVendor(vendorState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.name}
                    onChange={(e) => setVendor({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Email</span>
                  <input
                    name="email"
                    placeholder="Email"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.email}
                    onChange={(e) => setVendor({ email: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Phone</span>
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.phone}
                    onChange={(e) => setVendor({ phone: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={createVendor}
              firstButtonText="Add"
              firstDisabled={vendor.name === "" || vendor.email === ""}
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
          {data.vendor.map((vendor: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                if (!openAddModal) {
                  setVendor({
                    id: parseInt(vendor.id),
                    name: vendor.name,
                    email: vendor.email,
                    phone: vendor.phoneNumber,
                  });
                  setOpenEditor(true);
                }
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{vendor.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">{vendor.name}</td>
              <td className="py-4 px-6 whitespace-nowrap">{vendor.email}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                {vendor.phoneNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="fixed right-5 bottom-5 z-50 bg-white rounded-3xl"
        onClick={() => {
          if (!openEditor) {
            setVendor(vendorState);
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

export default Vendors;
