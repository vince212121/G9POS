import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  item: any;
  index: number;
};

const MenuItems = ({ item, index }: Props) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <li
      className=""
      key={index}
      onMouseOver={() => {
        setDropdown(true);
      }}
      onMouseLeave={() => {
        setDropdown(false);
      }}
    >
      {item.submenu ? (
        <>
          <button
            type="button"
            onClick={() => {
              setDropdown(!dropdown);
            }}
            aria-expanded={dropdown ? "true" : "false"}
          >
            <div className="flex">
              {item.title}
              {dropdown ? (
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
                    d="m5 15 7-7 7 7"
                  />
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
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              )}
            </div>
          </button>
          <ul className={`${dropdown ? "space-y-4 mt-2" : "hidden"}`}>
            {item.submenu.map((submenu: any, i: number) => (
              <li key={i} className="">
                {submenu.submenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdown(!dropdown);
                      }}
                      aria-expanded={dropdown ? "true" : "false"}
                    >
                      <span className="flex">
                        {submenu.title}
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
                            d="m5 15 7-7 7 7"
                          />
                        </svg>
                      </span>
                    </button>
                    <div className="flex flex-col my-2 space-y-2">
                      {submenu.submenu.map((submenu2: any, j: number) => (
                        <Link
                          to={submenu2.url}
                          className="text-left ml-4 "
                          key={j}
                        >
                          <span>{submenu2.title}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link to={submenu.url}>{submenu.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link to={item.url} className={`${item.url === "/" ? "ml-4" : ""}`}>
          {item.title}
        </Link>
      )}
    </li>
  );
};

export default MenuItems;
