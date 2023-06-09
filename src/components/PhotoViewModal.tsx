import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";
import { usePhotoView, usePhotoViewModal } from "../../lib/zustand";
import Modal from "./Modal";

const PhotoViewModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = usePhotoViewModal();
  const { src, size } = usePhotoView();

  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  return (
      <Modal>
        <div
          ref={modalRef}
          className={`relative mx-auto flex items-center  ${
            size === "medium" ? "h-[200px]  w-[200px]" : "w-3/4 h-[400px]"
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
