import React, { useRef } from "react";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useCreateModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";
import CreateTweet from "./CreateTweet";

const CreateModal = () => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { setModal } = useCreateModal();

    useOnClickOutside(modalRef,()=>{
        setModal(false)
    })
  return (
    <Backdrop>
        
      <div ref={modalRef} className="relative mx-auto max-h-[500px] max-w-xs md:max-w-lg overflow-y-scroll rounded-2xl  bg-base-100 p-4 text-black">
        <CreateTweet />
      </div>
    </Backdrop>
  );
};

export default CreateModal;
