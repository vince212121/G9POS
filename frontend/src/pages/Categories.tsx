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
    category(userToken: $userToken) {
      id
      name
    }
  }
`;

const VENDOR_MUTATION = gql`
  mutation CategoryMutation(
    $action: String!
    $name: String!
    $categoryId: Int
    $userToken: String!
  ) {
    categoryMutation(
      action: $action
      name: $name
      categoryId: $categoryId
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

const Categories = (props: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAGE_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [categoryResult, categoryMutation] = useMutation(VENDOR_MUTATION);

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

  const categoryState = {
    id: 0,
    name: "",
    userToken: userToken,
  };
  const [category, setCategory] = useReducer(reducer, categoryState);

  if (!userToken)
    return <Error message="401 - Unauthorized access to categorys" />;

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const createCategory = async () => {
    let addResult = await categoryMutation({
      action: "add",
      name: category.name,
      userToken: category.userToken,
    });
    if (addResult?.data?.categoryMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setCategory(categoryState);
      setMessage({
        message: "Created Category",
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

  const updateCategory = async () => {
    let updateResult = await categoryMutation({
      action: "update",
      name: category.name,
      categoryId: category.id,
      userToken: category.userToken,
    });
    if (updateResult?.data?.categoryMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setCategory(categoryState);
      setMessage({
        message: "Updated Category",
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

  const deleteCategory = async () => {
    if (window.confirm("do you want to delete?")) {
      let deleteResult = await categoryMutation({
        action: "delete",
        name: category.name,
        categoryId: category.id,
        userToken: category.userToken,
      });
      if (deleteResult?.data?.categoryMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setCategory(categoryState);
        setMessage({
          message: "Deleted Category",
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
        <Modal title="Edit Category" setCloseModal={setOpenEditor}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setCategory(categoryState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={category.name}
                    onChange={(e) => setCategory({ name: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateCategory}
              firstButtonText="Save"
              firstDisabled={category.name === ""}
              secondButtonClick={deleteCategory}
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
        <Modal title="Add Category" setCloseModal={setAddModal}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setCategory(categoryState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={category.name}
                    onChange={(e) => setCategory({ name: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={createCategory}
              firstButtonText="Add"
              firstDisabled={category.name === ""}
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
          </tr>
        </thead>
        <tbody>
          {data.category.map((category: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                if (!openAddModal) {
                  setCategory({
                    id: parseInt(category.id),
                    name: category.name,
                  });
                  setOpenEditor(true);
                }
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{category.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="fixed right-5 bottom-5 z-50 bg-white rounded-3xl"
        onClick={() => {
          if (!openEditor) {
            setCategory(categoryState);
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

export default Categories;
