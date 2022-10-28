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
          <ul className={`${dropdown ? "" : "hidden"}`}>
            {item.submenu.map((submenu: any, i: number) => (
              <li key={i}>
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
                    <div className="flex flex-col">
                      {submenu.submenu.map((submenu2: any, j: number) => (
                        <Link to={submenu2.url} className="text-right md:pl-4" key={j}>
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
        <Link to={item.url} className="pl-4 md:pl-0">{item.title}</Link>
      )}
    </li>
  );
};

export default MenuItems;
