import React, { useState } from "react";

type Props = {
  title: string;
  children: any;
};

const Accordian = ({ title, children }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="border-solid border-4 w-3/4">
        <div>
          <div onClick={() => setIsActive(!isActive)}>
            <div
              className={`flex flex-row bg-slate-200 p-2 ${
                isActive ? "border-b border-gray-400" : ""
              }`}
            >
              {title}
              <div className="ml-4">
                {isActive ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
          {isActive && <div className="bg-slate-200	px-4">{children}</div>}
        </div>
      </div>
    </>
  );
};
export default Accordian;
