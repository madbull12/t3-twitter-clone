import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import { useCreateModal } from "../../lib/zustand";

const MobileCreate = () => {
    const { setModal } = useCreateModal();
  return (
    <div className="fixed bottom-16 right-2 z-[99999] ">
      <IoMdAddCircle
        onClick={() => setModal(true)}
        className="cursor-pointer text-primary text-6xl"
      />
    </div>
  );
};

export default MobileCreate;
