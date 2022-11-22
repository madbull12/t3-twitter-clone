import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import { BsTwitter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useLoginModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";

const LoginModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { setModal } = useLoginModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  return (
    <Backdrop>
      <div
        ref={modalRef}
        className="relative mx-auto max-h-[500px] max-w-lg overflow-y-scroll rounded-2xl  bg-white p-4 text-black"
      >
        <IoClose
          className="absolute top-4 left-4 cursor-pointer text-2xl"
          onClick={() => setModal(false)}
        />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <BsTwitter className="text-3xl  text-primary" />
          <h1 className="text-3xl font-bold">Login Twitter</h1>
          <button
            onClick={() => signIn("twitter")}
            className={`${"px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black"}`}
          >
            Sign in
          </button>
        </div>
      </div>
    </Backdrop>
  );
};

export default LoginModal;
