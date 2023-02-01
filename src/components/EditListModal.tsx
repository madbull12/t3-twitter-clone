import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiFillCamera } from "react-icons/ai";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";
import useMediaUpload from "../../hooks/useMediaUpload";
import { useEditListModal, useManageModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Backdrop from "./Backdrop";
import Loader from "./Loader";
import Modal from "./Modal";
import { AnimatePresence, motion } from "framer-motion";
import ManageModal from "./ManageModal";
type List = {
  name: string;
  description: string;
};
const EditListModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const { setModal: setEditModal } = useEditListModal();
  const { setModal: setManageModal } = useManageModal();
  let coverPhotoUrl: null | string = null;
  const router = useRouter();
  const { listId } = useRouter().query;
  useOnClickOutside(modalRef, () => {
    setEditModal(false);
  });
  const utils = trpc.useContext();
  const [isPrivate, setPrivate] = useState(false);
  const handleChecked = () => {
    setPrivate(!isPrivate);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<List>();

  const {
    // upload: coverPhotoUpload,
    onSelectFile: onSelectFileCoverPhoto,
    preview: coverPhotoPreview,
    selectedFile: coverPhotoSelectedFile,
    setSelectedFile: setCoverPhotoSelectedFile,
  } = useMediaUpload();
  const { data: listDetails, isLoading } = trpc.list.getListDetails.useQuery({
    listId: listId as string,
  });
  const { mutateAsync: editList } = trpc.list.editList.useMutation({
    onMutate: () => {
      utils.list.getListDetails.invalidate({ listId: listId as string });
      const optimisticUpdate = utils.list.getListDetails.getData();
      if (optimisticUpdate) {
        utils.list.getListDetails.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.list.getListDetails.invalidate({ listId: listId as string });
    },
  });
  const { mutateAsync: deleteList } = trpc.list.deleteList.useMutation({
    // onMutate: () => {
    //   utils.list.getListDetails.invalidate({ listId: listId as string });
    //   const optimisticUpdate = utils.list.getListDetails.getData();
    //   if (optimisticUpdate) {
    //     utils.list.getListDetails.setData(optimisticUpdate);
    //   }
    // },
    onSettled: () => {
      router.push(`/list/${listDetails?.creatorId}`);
    },
  });

  const handleDelete = async () => {
    setEditModal(false);
    await toast.promise(deleteList({ listId: listId as string }), {
      loading: "Deleting list",
      success: "List deleted",
      error: (err) => `Oops... something went wrong ` + err,
    });
  };

  const coverPhotoUpload = async () => {
    const formData = new FormData();
    formData.append("file", coverPhotoSelectedFile);
    formData.append("upload_preset", "xap2a5k4");
    // formData.append("file", );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dem2vt6lj/${
        coverPhotoSelectedFile.type === "video/mp4" ? "video" : "image"
      }/upload`,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());

    coverPhotoUrl = res.secure_url;
  };

  const onSubmit: SubmitHandler<List> = async (data) => {
    setEditModal(false);
    if (coverPhotoSelectedFile) {
      await coverPhotoUpload();
    }
    await toast.promise(
      editList({
        ...data,
        isPrivate,
        coverPhoto: (coverPhotoUrl as string) ?? listDetails?.coverPhoto,
        listId: listId as string,
      }),
      {
        loading: "Updating list",
        success: "List updated",
        error: (err) => `Oops something went wrong - ${err}`,
      }
    );
  };

  return (
    <Modal>
      <div
        ref={modalRef}
        className="relative mx-auto flex h-[550px] max-w-2xl gap-x-2  overflow-x-hidden overflow-y-scroll rounded-2xl  bg-base-100 "
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
          <header className="flex items-center justify-between gap-x-1 p-4 xs:gap-x-2 sm:gap-x-4">
            <IoMdClose
              className="cursor-pointer text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl"
              onClick={() => setEditModal(false)}
            />
            <p className="mr-auto whitespace-nowrap text-xs font-semibold xs:text-sm sm:text-base md:text-lg lg:text-xl">
              Edit list
            </p>
            <button
              type="submit"
              className={` rounded-full bg-black px-2 py-1 text-xs font-semibold text-white sm:text-sm md:px-3`}
            >
              Done
            </button>
          </header>
          <div className="relative grid h-32 w-full place-items-center bg-gray-200 xs:h-36 sm:h-44 lg:h-48 ">
            {coverPhotoPreview || listDetails?.coverPhoto ? (
              <Image
                layout="fill"
                src={coverPhotoPreview ?? (listDetails?.coverPhoto as string)}
                objectFit="cover"
              />
            ) : null}
            <input
              className=""
              id="coverSelect"
              hidden
              type="file"
              onChange={onSelectFileCoverPhoto}
              accept="image/png,  image/jpeg"
              // defaultValue={""}
              // {...register("coverPhoto")}
            />
            <label
              htmlFor="coverSelect"
              className="z-50 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-gray-500 text-xl text-white transition-all ease-in-out hover:bg-gray-600 xs:h-12 xs:w-12 xs:text-3xl"
            >
              <AiFillCamera />
            </label>
          </div>
          <div className="mt-4 flex w-full flex-col gap-y-4 p-2">
            <input
              type="text"
              placeholder="Name"
              defaultValue={listDetails?.name}
              // onChange={(e) => setName(e.target.value)}
              {...register("name")}
              className="input-bordered  input-primary input w-full  "
            />
            <textarea
              className="textarea-primary textarea resize-none"
              placeholder="Description"
              {...register("description")}
              defaultValue={listDetails?.description as string}
            ></textarea>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Make private</span>
                <input
                  onChange={handleChecked}
                  defaultChecked={listDetails?.isPrivate}
                  type="checkbox"
                  checked={isPrivate}
                  className="checkbox-primary checkbox"
                />
              </label>
            </div>
            <button
              type="button"
              className="flex items-center justify-between p-1 text-sm"
              onClick={() => {
                setManageModal(true);
              }}
            >
              <p className="label-text">Manage members</p>
              <IoIosArrowForward />
            </button>
            <button
              className="text-red-600 hover:text-red-500"
              type="button"
              onClick={handleDelete}
            >
              Delete List
            </button>
          </div>
        </form>

          <ManageModal />
      </div>
    </Modal>
  );
};

export default EditListModal;
