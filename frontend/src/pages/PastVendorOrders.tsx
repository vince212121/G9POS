import React, { useState, useReducer, useEffect } from "react";
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
    vendorOrder(userToken: $userToken)
    product(userToken: $userToken)
  }
`;

const VENDOR_ORDER_MUTATION = gql`
  mutation VendorOrderMutation(
    $action: String!
    $orderId: Int!
    $vendorData: GenericScalar!
    $items: GenericScalar!
    $originalItems: GenericScalar!
    $quantityOrdered: Int!
    $userToken: String!
  ) {
    vendorOrderMutation(
      action: $action
      orderId: $orderId
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

type Props = {};

const PastVendorOrders = ({}: Props) => {
  const userToken = Cookies.get("token");
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAST_ORDERS,
    variables: { userToken },
  });
  const { data, fetching, error } = result;

  const [vendorResult, vendorMutation] = useMutation(VENDOR_ORDER_MUTATION);

  const [openEditor, setOpenEditor] = useState(false);
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
    vendor: {},
    items: [],
    userToken: userToken,
    quantityOrdered: 0,
  };
  const [initialVendor, setInitialVendor] = useReducer(reducer, vendorState);
  const [vendor, setVendor] = useReducer(reducer, vendorState);

  useEffect(() => {
    reexecuteQuery({ requestPolicy: "network-only" });
  }, [reexecuteQuery]);

  if (!userToken) {
    return <Error message="401 - Unauthorized access to inventory" />;
  }

  if (fetching) return <LoadingData />;

  if (error) return <Error />;

  const updateOrder = async () => {
    let editResult = await vendorMutation({
      action: "update",
      orderId: vendor.id,
      vendorData: vendor.vendor,
      items: vendor.items,
      originalItems: initialVendor.items,
      quantityOrdered: vendor.quantityOrdered,
      userToken: vendor.userToken,
    });
    if (editResult?.data?.vendorOrderMutation?.ok) {
      reexecuteQuery({ requestPolicy: "network-only" });
      setVendor(vendorState);
      setInitialVendor(vendorState);
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
      let deleteResult = await vendorMutation({
        action: "delete",
        orderId: initialVendor.id,
        vendorData: initialVendor.vendor,
        items: initialVendor.items,
        originalItems: initialVendor.items,
        quantityOrdered: initialVendor.quantityOrdered,
        userToken: initialVendor.userToken,
      });

      if (deleteResult?.data?.vendorOrderMutation?.ok) {
        reexecuteQuery({ requestPolicy: "network-only" });
        setInitialVendor(vendorState);
        setVendor(vendorState);
        setMessage({
          message: "Deleted vendor order",
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
    const index = vendor.items.findIndex(
      (vendorItem: any) => vendorItem.name === item.name
    );
    if (index > -1) {
      setVendor({
        items: vendor.items.filter(
          (vendorItem: any) =>
            vendorItem.name !== item.name && vendorItem.brand !== item.brand
        ),
      });
    } else {
      setVendor({ items: [...vendor.items, item] });
    }
  };

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen overflow-x-auto">
      {openEditor && (
        <Modal title="Edit Order" setCloseModal={setOpenEditor}>
          <div className="sm:h-[10rem] overflow-y-auto md:h-full">
            <div className="p-6 space-y-6 flex flex-col overflow-y-auto">
              <form
                className="flex flex-col space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setVendor(vendorState);
                }}
              >
                <div className="space-x-3 md:space-x-0 flex justify-center items-center">
                  <span>Quantity Ordered</span>
                  <input
                    type="number"
                    name="quantity_ordered"
                    placeholder="Quantity Ordered"
                    className="p-2 border-b border-gray-700 bg-white w-full"
                    value={vendor.quantityOrdered}
                    onChange={(e) => {
                      const quantity =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      if (quantity > 0)
                        setVendor({
                          quantityOrdered: quantity,
                        });
                    }}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <span className="mr-16">Items</span>
                  <div className="bg-white flex flex-col space-y-2 overflow-y-auto w-full">
                    {data.product
                      .filter(
                        (prod: any) => prod.vendor.name === vendor.vendor.name
                      )
                      .map((item: any, index: number) => {
                        let selected =
                          vendor.items.findIndex(
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
              </form>
            </div>
            {/* Modal footer */}
            <ModalButtons
              firstButtonClick={updateOrder}
              firstButtonText="Save"
              firstDisabled={vendor.items.length === 0}
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
            <th className="py-3 px-6">Vendor</th>
            <th className="py-3 px-6">Items</th>
            <th className="py-3 px-6">Date Purchased</th>
            <th className="py-3 px-6">Quantity Ordered</th>
            <th className="py-3 px-6">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.vendorOrder.map((vo: any, index: number) => (
            <tr
              className="border-b border-gray-700 bg-gray-100"
              key={index}
              onClick={() => {
                setInitialVendor({
                  id: vo.id,
                  vendor: vo.vendor,
                  items: vo.items,
                  quantityOrdered: vo.quantity_ordered,
                });
                setVendor({
                  id: vo.id,
                  vendor: vo.vendor,
                  items: vo.items,
                  quantityOrdered: vo.quantity_ordered,
                });
                setOpenEditor(true);
              }}
            >
              <td className="py-4 px-6 whitespace-nowrap">{vo.id}</td>
              <td className="py-4 px-6 whitespace-nowrap">{vo.vendor.name}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex flex-col">
                  {vo.items.map((item: any, itemIndex: number) => (
                    <span key={itemIndex}>
                      {item.name} - {item.brand}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                {vo.date_purchased}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                {vo.quantity_ordered}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">{vo.total_cost}</td>
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

export default PastVendorOrders;
