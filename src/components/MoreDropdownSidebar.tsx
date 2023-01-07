import React from "react";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";
import { FaPaintBrush } from 'react-icons/fa'
import { useDisplayModal } from "../../lib/zustand";
const MoreDropdownSidebar = () => {
    const { setModal } = useDisplayModal(); 
  return (
    <div className="dropdown relative z-[1000]">
      <li tabIndex={0} className="cursor-pointer rounded-full  px-4  py-2 transition-all duration-200 ease-in-out  hover:bg-base-300">
        <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
          <IoEllipsisHorizontalCircleOutline />
          <span className="hidden xl:block ">More</span>
        </div>
      </li>
      <ul
        tabIndex={0}
        className="dropdown-content absolute top-0 menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        <li onClick={()=>setModal(true)}>
          <a>
            <FaPaintBrush />
            Display
          </a>
        </li>
    
      </ul>
    </div>
  );
};

export default MoreDropdownSidebar;
