import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useReplyModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";

const ReplyModal = () => {
  const { setModal } = useReplyModal();
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  return (
    <Backdrop>
      <div ref={modalRef} className="relative mx-auto max-w-lg rounded-2xl  bg-white p-4 text-black">
        <IoClose className="absolute top-2 left-2 text-lg cursor-pointer" onClick={()=>setModal(false)} />
      </div>
    </Backdrop>
  );
};

export default ReplyModal;
