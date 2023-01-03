import React from "react";
import { BiDotsHorizontal } from "react-icons/bi";

const MenuDropdown = () => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className=" cursor-pointer ">
        <BiDotsHorizontal className="text-xl text-gray-400" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        <li >
          <a className="text-red-500">Delete</a>
        </li>
        {/* <li>
          <a>Item 2</a>
        </li> */}
      </ul>
    </div>
  );
};

export default MenuDropdown;
