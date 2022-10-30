import React, { useState, useReducer } from "react";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import Message from "../components/Message";

const GET_INVENTORY_DATA = gql`
  query {
    product
    category {
      id
      name
    }
    vendor {
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
    ) {
      ok
      status
      message
    }
  }
`;

const TEST = gql`
  mutation TestMutation($email: String!) {
    testMutation(email: $email) {
      ok
    }
  }
`;

type Props = {};

const Inventory = (props: Props) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_DATA,
  });
  const { data, fetching, error } = result;

  const [productResult, productMutation] = useMutation(PRODUCT_MUTATION);
  const [testResult, testMutation] = useMutation(TEST);

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
  };
  const [initialProduct, setInitialProduct] = useReducer(reducer, productState);
  const [product, setProduct] = useReducer(reducer, productState);

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  //   console.log(data, productState);

  return (
    <div className="lg:mx-4 mt-8 w-screen overflow-x-auto">
      {openEditor && (
        <Modal title="Edit Product" setCloseModal={setOpenEditor}>
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
                  onChange={(e) => setProduct({ description: e.target.value })}
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
                  onChange={(e) => setProduct({ quantity: e.target.value })}
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
                  onChange={(e) => setProduct({ quantitySold: e.target.value })}
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
                  //   defaultValue={""}
                  onChange={(e) => {
                    let category = data.category.find(
                      (cat: any) => cat.name === e.target.value
                    );
                    if (category) {
                      setProduct({
                        // category: {
                        //   id: category.id,
                        //   name: category.name,
                        // },
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
                        // vendor: {
                        //   id: vendor.id,
                        //   name: vendor.name,
                        // },
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
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              type="submit"
              className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={async () => {
                // TODO: process data
                let test = await testMutation({ email: "1234" });
                console.log(test);

                setMessage({
                  message: "Product saved",
                  error: false,
                  confirmation: true,
                });
                setShowMessage(true);
                setOpenEditor(false);
              }}
            >
              Save
            </button>
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={async () => {
                // TODO: delete product
                if (window.confirm("do you want to delete?")) {
                  console.log(initialProduct.vendor);
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
                  });
                  console.log(deleteResult);
                  if (deleteResult?.data?.ok) {
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
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="text-gray-500 bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-500 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
              onClick={() => {
                setOpenEditor(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
      {openAddModal && (
        <Modal title="Add Product" setCloseModal={setAddModal}>
          <div></div>
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
          if (openEditor) {
            setShowMessage(true);
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
