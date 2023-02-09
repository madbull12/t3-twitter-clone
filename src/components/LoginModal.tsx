import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { BsTwitter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useLoginModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";
import Modal from "./Modal";

const LoginModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setModal } = useLoginModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  return (
      <Modal>
        <div
          ref={modalRef}
          className="mx-auto relative h-[200px] w-3/4 space-y-3  rounded-2xl  bg-base-100 p-4 sm:w-1/2"
        >
          <IoClose
            className="absolute top-4 left-4 cursor-pointer text-2xl"
            onClick={() => setModal(false)}
          />
          <div className="flex flex-col items-center justify-center gap-y-2">
            <BsTwitter className="text-3xl  text-primary" />
            <h1 className="text-3xl font-bold">Login Twitter</h1>
            <button
              onClick={() => {
                router.push("/auth/signin");
                setModal(false);
              }}
              className={`${"px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-neutral"}`}
            >
              Sign in
            </button>
          </div>
        </div>
      </Modal>
  );
};

export default LoginModal;
