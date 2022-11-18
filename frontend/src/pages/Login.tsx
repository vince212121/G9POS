import React, { useReducer, useState } from "react";
import { gql, useMutation } from "urql";
import Message from "../components/Message";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const USER_LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      ok
      status
      message
      token
    }
  }
`;

type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const [loginResult, loginMutation] = useMutation(USER_LOGIN_MUTATION);
  const reducer = (state: any, newState: any) => ({ ...state, ...newState });

  const [showMessage, setShowMessage] = useState(false);
  const messageState = {
    message: "",
    errors: false,
    confirmation: false,
  };
  const [message, setMessage] = useReducer(reducer, messageState);
  const userState = {
    email: "",
    password: "",
  };

  const [user, setUser] = useReducer(reducer, userState);

  return (
    <div className="lg:mx-4 mt-8 h-screen w-screen flex justify-center">
      <form
        className="flex flex-col w-full mx-6 lg:mx-0 lg:w-1/3 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setUser(userState);
        }}
      >
        <h2 className="text-xl font-semibold">Login</h2>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Email</span>
          <input
            name="email"
            placeholder="Email"
            className="p-2 border-b border-gray-700 bg-white w-full"
            value={user.email}
            onChange={(e) => setUser({ email: e.target.value })}
          />
        </div>
        <div className="space-y-2 flex flex-col justify-center items-start">
          <span className="text-sm">Password</span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 border-b border-gray-700 bg-white w-full"
            value={user.password}
            onChange={(e) => setUser({ password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className={` ${
            user.email === "" || user.password === ""
              ? "cursor-not-allowed"
              : "hover:bg-gray-900"
          }
          text-white font-semibold bg-gray-700  focus:ring-0 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center`}
          onClick={async () => {
            let loginResult = await loginMutation({
              email: user.email,
              password: user.password,
            });
            if (loginResult?.data?.userLogin?.ok) {
              setUser(userState);
              Cookies.set("token", loginResult?.data?.userLogin?.token);
              navigate("/");
            } else {
              setMessage({
                message: "Something went wrong",
                error: true,
                confirmation: false,
              });
              setShowMessage(true);
            }
          }}
          disabled={user.email === "" || user.password === ""}
        >
          Login
        </button>
        <Link
          to="/register"
          className="text-gray-700 font-semibold bg-white hover:bg-gray-200 border border-gray-700 focus:ring-0 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Register
        </Link>
      </form>
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

export default Login;
