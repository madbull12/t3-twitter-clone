import Image from "next/legacy/image";
import React, { useRef,useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillCamera } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import useMediaUpload from "../../hooks/useMediaUpload";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useCreateListModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Backdrop from "./Backdrop";
import Modal from "./Modal";
import { AnimatePresence } from 'framer-motion'

const CreateListModal = () => {
  const modalRef = useRef<HTMLFormElement>(null);
  let coverPhotoUrl:null | string = null;
  const [name,setName] = useState("");
  const utils = trpc.useContext()
  const [desc,setDesc] = useState("");
  const [isPrivate,setPrivate] = useState(false);
  const { mutateAsync:createList } = trpc.list.createList.useMutation({
    onMutate: () => {
      utils.list.getUserLists.invalidate();
      const optimisticUpdate = utils.list.getUserLists.getData();
      if (optimisticUpdate) {
        utils.list.getUserLists.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.list.getUserLists.invalidate();
    },
  });
  const { setModal } = useCreateListModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const {
    // upload: coverPhotoUpload,
    onSelectFile: onSelectFileCoverPhoto,
    preview: coverPhotoPreview,
    selectedFile: coverPhotoSelectedFile,
    setSelectedFile: setCoverPhotoSelectedFile,
  } = useMediaUpload();

  const handleChecked = () => {
    setPrivate(!isPrivate);
  }

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

  const handleSubmit = async() => {
    setModal(false)
    if (coverPhotoSelectedFile) {
      await coverPhotoUpload();
    }
    await toast.promise(createList({ name,description:desc,isPrivate,coverPhoto:coverPhotoUrl as string }),{
      loading:"Creating list",
      success:"List created",
      error:(err)=>`Oops something went wrong - ${err}`
    })
   


  }
  return (

<Modal>
      <form
        ref={modalRef}
        onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit()
        }}
        className="mx-auto h-[500px] w-3/4 overflow-y-scroll rounded-2xl  bg-base-100 sm:w-1/2"
      >
        <header className="flex items-center justify-between gap-x-1 p-4 xs:gap-x-2 sm:gap-x-4">
          <IoMdClose
            className="cursor-pointer text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => setModal(false)}
          />
          <p className="mr-auto whitespace-nowrap text-xs font-semibold xs:text-sm sm:text-base md:text-lg lg:text-xl">
            Create new list
          </p>
          <button disabled={name.length<=0} type="submit" className={`${name.length<=0 ? "bg-slate-300":null} rounded-full bg-black px-2 py-1 text-xs font-semibold text-white sm:text-sm md:px-3`}>
            Next
          </button>
        </header>
        <div className="relative grid h-32 w-full place-items-center bg-gray-200 xs:h-36 sm:h-44 lg:h-48 ">
          {coverPhotoPreview ? (
            <Image layout="fill" src={coverPhotoPreview} objectFit="cover" />
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
            onChange={(e)=>setName(e.target.value)}
            className="input-bordered  input-primary input w-full  "
          />
          <textarea
            className="textarea-primary textarea resize-none"
            placeholder="Description"
            onChange={(e)=>setDesc(e.target.value)}
          ></textarea>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Make private</span>
              <input
              onChange={handleChecked}
                type="checkbox"
                checked={isPrivate}
                className="checkbox-primary checkbox"
              />
            </label>
          </div>
        </div>
      </form>
    </Modal>
    
  );
};

export default CreateListModal;
