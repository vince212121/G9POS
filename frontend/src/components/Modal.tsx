import React from "react";

type Props = {
  title: string;
  children: any;
  setCloseModal: any;
};

const Modal = ({ title, children, setCloseModal }: Props) => {
  return (
    <div
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed z-50 w-full md:inset-0 md:h-full flex items-center justify-center"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        {/* Modal content */}
        <div className="relative bg-gray-100 rounded-lg shadow">
          {/* Modal header */}
          <div className="flex justify-between items-start p-4 rounded-t border-b border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                setCloseModal(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
