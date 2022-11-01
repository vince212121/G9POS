import React, { useState } from "react";

type Props = {
  firstButtonText?: string;
  firstDisabled?: boolean;
  firstButtonClick?: any;
  secondButtonText?: string;
  secondDisabled?: boolean;
  secondButtonClick?: any;
  thirdButtonText?: string;
  thirdDisabled?: boolean;
  thirdButtonClick?: any;
};

const ModalButtons = ({
  firstButtonText,
  firstButtonClick,
  firstDisabled,
  secondButtonClick,
  secondDisabled,
  secondButtonText,
  thirdButtonClick,
  thirdDisabled,
  thirdButtonText,
}: Props) => {
  return (
    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
      {firstButtonText && (
        <button
          type="submit"
          className={`${
            firstDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700"
          } text-white hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
          onClick={() => {
            firstButtonClick();
          }}
          disabled={firstDisabled ?? false}
        >
          {firstButtonText}
        </button>
      )}

      {secondButtonText && (
        <button
          type="submit"
          className={`${
            secondDisabled ? "bg-red-500 cursor-not-allowed" : "bg-red-700"
          }
          text-white hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
          onClick={() => {
            secondButtonClick();
          }}
          disabled={secondDisabled ?? false}
        >
          {secondButtonText}
        </button>
      )}

      {thirdButtonText && (
        <button
          type="button"
          className={`${
            thirdDisabled ? "bg-white cursor-not-allowed" : "bg-gray-100"
          } text-gray-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-500 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10`}
          onClick={() => {
            thirdButtonClick();
          }}
          disabled={thirdDisabled ?? false}
        >
          {thirdButtonText}
        </button>
      )}
    </div>
  );
};

export default ModalButtons;
