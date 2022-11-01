import React, { useState, useReducer } from "react";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import Message from "../components/Message";

const GET_PAST_ORDERS = gql`
  query {
    vendorOrder
    product
    vendor {
      id
      name
      email
      phoneNumber
    }
  }
`;

const VENDOR_ORDER_MUTATION = gql`
  mutation VendorMutation(
    $action: String!
    $order_id: Int!
    $vendor_data: GenericScalar!
    $items: GenericScalar!
    $quantity_ordered: Int!
  ) {
    vendorMutation(
      action: $action
      order_id: $order_id
      vendor_data: $vendor_data
      items: $items
      quantity_ordered: $quantity_ordered
    ) {
      ok
      status
      message
    }
  }
`;

type Props = {};

const PastVendorOrders = ({}: Props) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAST_ORDERS,
  });
  const { data, fetching, error } = result;

  const [vendorResult, vendorMutation] = useMutation(VENDOR_ORDER_MUTATION);

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

  return <div>PastVendorOrders</div>;
};

export default PastVendorOrders;
