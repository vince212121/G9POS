import React from "react";
import { gql, useMutation, useQuery } from "urql";

type Props = {};
const TEST = gql`
  mutation TestMutation($email: String!) {
    testMutation(email: $email) {
      ok
    }
  }
`;

const PastCustomerOrders = (props: Props) => {
  const [testResult, testMutation] = useMutation(TEST);
  return (
    <div>
      <div>Past Orders</div>
      <button
        className="border p-4"
        onClick={async () => {
          console.log(await testMutation({ email: "test" }));
        }}
      >
        test
      </button>
    </div>
  );
};

export default PastCustomerOrders;
