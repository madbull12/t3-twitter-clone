import React, { useRef } from "react";
import { FaPaintBrush } from "react-icons/fa";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useDisplayModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";

const DisplayModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = useDisplayModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  return (
    <Backdrop>
      <div
        ref={modalRef}
        className="mx-auto flex h-[500px] w-3/4 flex-col items-center overflow-y-scroll rounded-2xl bg-white  p-4 sm:w-1/2"
      >
        <h1 className="text-2xl font-bold">Customize your view</h1>
        <p className="text-gray-500">
          These settings affect all the Twitter accounts on this browser.
        </p>
        <select data-choose-theme>
          <option value="">Default</option>
          <option value="dark">Dark</option>
          <option value="pink">Pink</option>
        </select>
      </div>
    </Backdrop>
  );
};

export default DisplayModal;
