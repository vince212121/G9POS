import React, { useState, useReducer } from "react";
import { gql, useMutation, useQuery } from "urql";
import Error from "../components/Error";
import LoadingData from "../components/LoadingData";
import Modal from "../components/Modal";
import Message from "../components/Message";

const GET_PAST_ORDERS = gql`
  query {
    customerOrder
    product
    customer {
      id
      name
      email
      phoneNumber
    }
  }
`;

const CUSTOMER_ORDER_MUTATION = gql`
  mutation CustomerMutation(
    $action: String!
    $order_id: Int!
    $customer_data: GenericScalar!
    $items: GenericScalar!
  ) {
    customerMutation(
      action: $action
      order_id: $order_id
      customer_data: $customer_data
      items: $items
    ) {
      ok
      status
      message
    }
  }
`;

type Props = {};

const PastCustomerOrders = (props: Props) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAST_ORDERS,
  });
  const { data, fetching, error } = result;

  const [productResult, productMutation] = useMutation(CUSTOMER_ORDER_MUTATION);

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

  return (
    <div className="lg:mx-4 mt-8 w-screen overflow-x-auto">
      <div>Past Orders</div>
    </div>
  );
};

export default PastCustomerOrders;
