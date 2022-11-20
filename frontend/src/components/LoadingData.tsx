import React from "react";

type Props = {};

const LoadingData = (props: Props) => {
  return (
    <div className="flex flex-col pb-40 justify-center items-center w-screen h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        className="w-6 h-6 animate-spin"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
        />
      </svg>
      <span>Loading</span>
    </div>
  );
};

export default LoadingData;
