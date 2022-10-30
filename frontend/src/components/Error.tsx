import React from "react";

type Props = {};

const Error = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        className="w-12 h-12"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
        />
      </svg>
      <span className="text-lg">An error occured</span>
    </div>
  );
};

export default Error;
