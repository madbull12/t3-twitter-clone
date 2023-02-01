import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useManageModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
const ManageModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { setModal } = useManageModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const slide = {
    hidden: {
      x: "100vw",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
    exit: {
      x: "100vw",
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={slide}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute   w-full   bg-base-100 p-4"
    >
      <div className="flex items-center  gap-x-8 text-xl font-semibold">
        <IoArrowBack className="cursor-pointer text-xl" />
        <p>Manage members</p>
      </div>
      <p>fdfd</p>
    </motion.div>
  );
};

export default ManageModal;
