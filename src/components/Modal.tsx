import React, { useState } from "react";
import Backdrop from "./Backdrop";
import { motion, AnimatePresence } from "framer-motion";
const Modal = ({ children }: { children: React.ReactNode }) => {
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  return (

      <Backdrop>
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          // className="mx-auto h-[500px] w-3/4 overflow-y-scroll rounded-2xl  bg-base-100 sm:w-1/2"
        >
          {children}
        </motion.div>
      </Backdrop>
  );
};

export default Modal;
