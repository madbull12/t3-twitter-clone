import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { BsTwitter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";
import { usePhotoView, usePhotoViewModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";
import Modal from "./Modal";

const PhotoViewModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = usePhotoViewModal();
  const { src, size } = usePhotoView();

  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  const router = useRouter()
  return (
      <Modal>
        <div
          ref={modalRef}
          className={`relative mx-auto ${
            size === "medium" ? "h-[200px]  w-[200px]" : "h-[400px] w-[700px]"
          } `}
        >
          <Image
            objectFit="cover"
            className="rounded-2xl"
            src={src}
            layout="fill"
          />
        </div>
      </Modal>

  );
};

export default PhotoViewModal;
