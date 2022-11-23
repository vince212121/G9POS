import React, { useState, useReducer, useEffect } from "react";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import Message from "../components/Message";
import Cookies from "js-cookie";
import ModalButtons from "../components/ModalButtons";

const GET_INVENTORY_DATA = gql`
  query ($userToken: String!) {
    product(userToken: $userToken)
    category(userToken: $userToken) {
      id
      name
    }
    vendor(userToken: $userToken) {
      id
      name
      email
      phoneNumber
    }
  }
`;

const PRODUCT_MUTATION = gql`
  mutation ProductMutation(
    $action: String!
    $category: GenericScalar!
    $vendor: GenericScalar!
    $name: String!
    $brand: String!
    $description: String!
    $quantity: Int!
    $quantitySold: Int!
    $price: Float!
    $userToken: String!
    $itemId: Int
  ) {
    productMutation(
      action: $action
      category: $category
      vendor: $vendor
      name: $name
      brand: $brand
      description: $description
      quantity: $quantity
      quantitySold: $quantitySold
      price: $price
      itemId: $itemId
      userToken: $userToken
    ) {
      ok
      status
      message
    }
  }
`;

type Props = {};

const Inventory = (props: Props) => {
  const userToken = Cookies.get("token");

  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_DATA,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  useEffect(() => {
    reexecuteQuery({ requestPolicy: "network-only" });
  }, [reexecuteQuery]);
  
  const [productResult, productMutation] = useMutation(PRODUCT_MUTATION);

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

  const productState = {
    id: 0,
    name: "",
    category: {},
    vendor: {},
    brand: "",
    description: "",
    quantity: 0,
    quantitySold: 0,
    price: 0.0,
    userToken: userToken,
  };
  const [initialProduct, setInitialProduct] = useReducer(reducer, productState);
  const [product, setProduct] = useReducer(reducer, productState);

  const addItem = async () => {
    let addResult = await productMutation({
      action: "add",
      category: product.category,
      vendor: product.vendor,
      name: product.name,
      brand: product.brand,
      description: product.description,
      quantity: product.quantity,
      quantitySold: product.quantitySold,
      price: product.price,
      userToken: product.userToken,
    });
    if (addResult?.data?.productMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setProduct(productState);
      setInitialProduct(productState);
      setMessage({
        message: "Added product",
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

  const updateItem = async () => {
    let editResult = await productMutation({
      action: "update",
      category: product.category,
      vendor: product.vendor,
      name: product.name,
      brand: product.brand,
      description: product.description,
      quantity: product.quantity,
      quantitySold: product.quantitySold,
      price: product.price,
      userToken: product.userToken,
      itemId: product.id,
    });
    if (editResult?.data?.productMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setProduct(productState);
      setInitialProduct(productState);
      setMessage({
        message: "Updated product",
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

  const deleteItem = async () => {
    if (window.confirm("do you want to delete?")) {
      let deleteResult = await productMutation({
        action: "delete",
        category: initialProduct.category,
        vendor: initialProduct.vendor,
        name: initialProduct.name,
        brand: initialProduct.brand,
        description: initialProduct.description,
        quantity: initialProduct.quantity,
        quantitySold: initialProduct.quantitySold,
        price: initialProduct.price,
        userToken: initialProduct.userToken,
        itemId: product.id,
      });
      if (deleteResult?.data?.productMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setProduct(productState);
        setInitialProduct(productState);
        setMessage({
          message: "Deleted product",
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

  if (!userToken) {
    return <Error message="401 - Unauthorized access to inventory" />;
  }

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen overflow-x-auto">
      {openEditor && (
        <Modal title="Edit Product" setCloseModal={setOpenEditor}>
          <div className="h-[30rem] sm:h-[10rem] md:h-full overflow-y-auto">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setProduct(productState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.name}
                    onChange={(e) => setProduct({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Brand</span>
                  <input
                    name="brand"
                    placeholder="Brand"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.brand}
                    onChange={(e) => setProduct({ brand: e.target.value })}
                  />
                </div>
                <div className="space-x-1 flex justify-center items-center">
                  <span>Description</span>
                  <input
                    name="description"
                    placeholder="Description"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ description: e.target.value })
                    }
                  />
                </div>
                <div className="space-x-6 flex justify-center items-center">
                  <span>Quantity</span>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.quantity}
                    onChange={(e) =>
                      setProduct({
                        quantity:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      })
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="space-x-3 md:space-x-0 flex justify-center items-center">
                  <span>Quantity Sold</span>
                  <input
                    type="number"
                    name="quantity_sold"
                    placeholder="Quantity Sold"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.quantitySold}
                    onChange={(e) =>
                      setProduct({
                        quantitySold:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      })
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Price</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.price}
                    step="0.01"
                    onChange={(e) => {
                      if (
                        !isNaN(parseFloat(e.target.value)) ||
                        /^\d+\.\d{0,2}$/.test(e.target.value)
                      ) {
                        setProduct({
                          price: parseFloat(e.target.value),
                        });
                      } else if (e.target.value === "") {
                        setProduct({
                          price: 0,
                        });
                      }
                    }}
                  />
                </div>
                <div className="space-x-5 flex justify-center items-center">
                  <span>Category</span>
                  <select
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    onChange={(e) => {
                      let category = data.category.find(
                        (cat: any) => cat.name === e.target.value
                      );
                      if (category) {
                        setProduct({
                          category: category,
                        });
                      } else {
                        setMessage({
                          message: "Category not found",
                          error: true,
                          confirmation: false,
                        });
                        setShowMessage(true);
                      }
                    }}
                    value={product.category.name}
                  >
                    <option disabled value="">
                      select an option
                    </option>
                    {data.category.map((cat: any, i: number) => (
                      <option key={`opt_${i}`} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-x-8 flex justify-center items-center">
                  <span>Vendor</span>
                  <select
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    onChange={(e) => {
                      let vendor = data.vendor.find(
                        (ven: any) => ven.name === e.target.value
                      );
                      if (vendor) {
                        setProduct({
                          vendor: vendor,
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
                    value={product.vendor.name}
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
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateItem}
              firstButtonText="Save"
              firstDisabled={
                product.name === "" ||
                product.description === "" ||
                product.brand === "" ||
                Object.keys(product.category).length === 0 ||
                Object.keys(product.vendor).length === 0
              }
              secondButtonClick={deleteItem}
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
        <Modal title="Add Product" setCloseModal={setAddModal}>
          <div className="h-[30rem] sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setProduct(productState);
                }}
              >
                <div className="space-x-10 flex justify-center items-center">
                  <span>Name</span>
                  <input
                    name="name"
                    placeholder="Name"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.name}
                    onChange={(e) => setProduct({ name: e.target.value })}
                  />
                </div>
                <div className="space-x-10 flex justify-center items-center">
                  <span>Brand</span>
                  <input
                    name="brand"
                    placeholder="Brand"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.brand}
                    onChange={(e) => setProduct({ brand: e.target.value })}
                  />
                </div>
                <div className="space-x-1 flex justify-center items-center">
                  <span>Description</span>
                  <input
                    name="description"
                    placeholder="Description"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ description: e.target.value })
                    }
                  />
                </div>
                <div className="space-x-6 flex justify-center items-center">
                  <span>Quantity</span>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.quantity}
                    onChange={(e) =>
                      setProduct({ quantity: parseInt(e.target.value) })
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="space-x-3 md:space-x-0 flex justify-center items-center">
                  <span>Quantity Sold</span>
                  <input
                    type="number"
                    name="quantity_sold"
                    placeholder="Quantity Sold"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.quantitySold}
                    onChange={(e) =>
                      setProduct({ quantitySold: parseInt(e.target.value) })
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="space-x-12 flex justify-center items-center">
                  <span>Price</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={product.price}
                    step="0.01"
                    onChange={(e) => {
                      if (
                        !isNaN(parseFloat(e.target.value)) ||
                        /^\d+\.\d{0,2}$/.test(e.target.value)
                      ) {
                        setProduct({
                          price: parseFloat(e.target.value),
                        });
                      } else if (e.target.value === "") {
                        setProduct({
                          price: 0,
                        });
                      }
                    }}
                  />
                </div>
                <div className="space-x-5 flex justify-center items-center">
                  <span>Category</span>
                  <select
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    defaultValue={""}
                    onChange={(e) => {
                      let category = data.category.find(
                        (cat: any) => cat.name === e.target.value
                      );
                      if (category) {
                        setProduct({
                          category: category,
                        });
                      } else {
                        setMessage({
                          message: "Category not found",
                          error: true,
                          confirmation: false,
                        });
                        setShowMessage(true);
                      }
                    }}
                    value={product.category.name}
                  >
                    <option disabled value="">
                      select an option
                    </option>
                    {data.category.map((cat: any, i: number) => (
                      <option key={`opt_${i}`} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-x-8 flex justify-center items-center">
                  <span>Vendor</span>
                  <select
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    defaultValue={""}
                    onChange={(e) => {
                      let vendor = data.vendor.find(
                        (ven: any) => ven.name === e.target.value
                      );
                      if (vendor) {
                        setProduct({
                          vendor: vendor,
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
                    value={product.vendor.name}
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
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={addItem}
              firstButtonText="Add"
              firstDisabled={
                product.name === "" ||
                product.description === "" ||
                product.brand === "" ||
                Object.keys(product.category).length === 0 ||
                Object.keys(product.vendor).length === 0
              }
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
            <th className="py-3 px-6">Brand</th>
            <th className="py-3 px-6">Vendor</th>
            <th className="py-3 px-6">Category</th>
            <th className="py-3 px-6">Description</th>
            <th className="py-3 px-6">Quantity</th>
            <th className="py-3 px-6">Quantity Sold</th>
            <th className="py-3 px-6">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.product.map((item: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                if (!openAddModal) {
                  setProduct({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    vendor: item.vendor,
                    brand: item.brand,
                    description: item.description,
                    quantity: item.quantity,
                    quantitySold: item.quantity_sold,
                    price: parseFloat(item.price),
                  });
                  setInitialProduct({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    vendor: item.vendor,
                    brand: item.brand,
                    description: item.description,
                    quantity: item.quantity,
                    quantitySold: item.quantity_sold,
                    price: parseFloat(item.price),
                  });
                  setOpenEditor(true);
                }
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{item.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">{item.name}</td>
              <td className="py-4 px-6 whitespace-nowrap">{item.brand}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                {item.vendor.name}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                {item.category.name}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                {item.description}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">{item.quantity}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                {item.quantity_sold}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="fixed right-5 bottom-5 z-50 bg-white rounded-3xl"
        onClick={() => {
          if (!openEditor) {
            setProduct(productState);
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

export default Inventory;
