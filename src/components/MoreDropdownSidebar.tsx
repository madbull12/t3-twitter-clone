import React from "react";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";
import { FaPaintBrush } from "react-icons/fa";
import { useDisplayModal, useHandleModal } from "../../lib/zustand";
import { AiOutlineEdit } from "react-icons/ai";
const MoreDropdownSidebar = ({ mobile }: { mobile?: boolean }) => {
  const { setModal } = useDisplayModal();
  const { setModal: setHandleModal } = useHandleModal();

  return (
    <div className="dropdown ">
      <li
        tabIndex={0}
        className="cursor-pointer rounded-full px-4 py-2 transition-all duration-200 ease-in-out  hover:bg-base-300"
      >
        <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
          <IoEllipsisHorizontalCircleOutline />
          <span className={`${mobile ? null : "hidden xl:block"}  `}>More</span>
        </div>
      </li>
      <ul
        tabIndex={0}
        className="dropdown-content   menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        <li onClick={() => setModal(true)}>
          <a>
            <FaPaintBrush />
            Display
          </a>
        </li>
        <li onClick={() => setHandleModal(true)}>
          <a>
            <AiOutlineEdit />
            Edit handle
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MoreDropdownSidebar;
