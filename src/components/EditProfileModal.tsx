import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "../../hooks/useOutsideClick";
import Backdrop from "./Backdrop";
import { useRef } from "react";
import Image from "next/legacy/image";
import { useEditProfileModal } from "../../lib/zustand";
import { AiFillCamera } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import { trpc } from "../utils/trpc";
import useMediaUpload from "../../hooks/useMediaUpload";
import { toast } from "react-hot-toast";
import Modal from "./Modal";

type Profile = {
  name: string;
  coverPhoto: string | null;
  image: string;
  bio: string;
  location: string;
  website: string;
};

const EditProfileModal = () => {
  const modalRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const utils = trpc.useContext();
  let imageUrl: string;
  let coverPhotoUrl: string;
  const {
    // upload: imageUpload,
    onSelectFile: onSelectFileImage,
    preview: imagePreview,
    selectedFile: imageSelectedFile,
    setSelectedFile: setImageSelectedFile,
    // mediaUrl:imageUrl
  } = useMediaUpload();
  const {
    // upload: coverPhotoUpload,
    onSelectFile: onSelectFileCoverPhoto,
    preview: coverPhotoPreview,
    selectedFile: coverPhotoSelectedFile,
    setSelectedFile: setCoverPhotoSelectedFile,
    // mediaUrl:coverPhotoUrl
  } = useMediaUpload();
  const { mutateAsync: editProfile } = trpc.profile.upsertProfile.useMutation({
    onMutate: () => {
      utils.user.getUserProfile.cancel();
      const optimisticUpdate = utils.user.getUserProfile.getData();
      if (optimisticUpdate) {
        utils.user.getUserProfile.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.user.getUserProfile.invalidate();
    },
  });
  const { data: userProfile } = trpc.user.getUserProfile.useQuery({
    userId: session?.user?.id as string,
  });

  const { setModal } = useEditProfileModal();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Profile>();

  const imageUpload = async () => {
    const formData = new FormData();
    formData.append("file", imageSelectedFile);
    formData.append("upload_preset", "xap2a5k4");
    // formData.append("file", );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dem2vt6lj/${
        imageSelectedFile.type === "video/mp4" ? "video" : "image"
      }/upload`,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());

    imageUrl = res.secure_url;
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

  const onSubmit: SubmitHandler<Profile> = async (data) => {
    if (imageSelectedFile) {
      await imageUpload();
    }
    if (coverPhotoSelectedFile) {
      await coverPhotoUpload();
    }

    const mutatedData: Profile = {
      ...data,
      image: imageUrl ?? (userProfile?.image as string),
      coverPhoto:
        coverPhotoUrl ?? (userProfile?.profile?.coverPhoto as string) ?? null,
    };

    toast.promise(editProfile(mutatedData), {
      success: "Profile saved",
      loading: "Saving new profile",
      error: (err) => "Oops.. something went wrong " + err,
    });

    setModal(false);
  };


  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={modalRef}
        className="mx-auto h-[500px] sm:w-1/2 w-3/4 overflow-y-scroll  rounded-2xl bg-base-100"
      >
        <header className="flex items-center justify-between gap-x-1 xs:gap-x-2 sm:gap-x-4 p-4">
          <IoMdClose className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl cursor-pointer" onClick={()=>setModal(false)} />
          <p className="mr-auto text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold whitespace-nowrap">Edit profile</p>
          <button className="rounded-full bg-black px-2 md:px-3 py-1 text-xs font-semibold text-white sm:text-sm">
            Save
          </button>
        </header>
        <div className="relative grid h-32 xs:h-36 sm:h-44 lg:h-48 w-full place-items-center bg-gray-200 ">
          {(coverPhotoPreview || userProfile?.profile?.coverPhoto) ? (
            <Image
              layout="fill"
              src={coverPhotoPreview ?? userProfile?.profile?.coverPhoto as string}
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
            className="grid z-50 xs:h-12 h-8 w-8 xs:w-12 cursor-pointer place-items-center rounded-full bg-gray-500 text-xl xs:text-3xl text-white transition-all ease-in-out hover:bg-gray-600"
          >
            <AiFillCamera />
          </label>
        </div>
        <div className="relative mx-4 -mt-12 grid h-[60px] w-[60px] xs:h-[80px] md:w-[100px] md:h-[100px]  xs:w-[80px]  place-items-center">
          <input
            className=""
            id="imageSelect"
            hidden
            type="file"
            accept="image/png,  image/jpeg"
            // defaultValue={userProfile?.image as string}
            // {...register("image")}
            onChange={onSelectFileImage}
          />
          <label
            htmlFor="imageSelect"
            className="z-50 grid h-6 w-6  xs:h-8 xs:w-8 cursor-pointer place-items-center rounded-full bg-gray-700 text-base  xs:text-xl text-white transition-all ease-in-out hover:bg-gray-800"
          >
            <AiFillCamera />
          </label>
          <Image
            className="rounded-full border-2 border-white"
            alt="profile"
            layout="fill"
            objectFit="cover"
            src={imagePreview ?? (userProfile?.image as string)}
          />

          {/* <label htmlFor="imageSelect" className="cursor-pointer">
            <AiOutlinePicture />
          </label> */}
        </div>
        <div className="flex flex-col gap-y-6 p-2 md:p-4">
          <input
            className="input-bordered  input-primary input w-full "
            placeholder="Name"
            defaultValue={userProfile?.name as string}
            {...register("name")}
          />
          <input
            className="input-bordered  input-primary input w-full "
            placeholder="Bio"
            defaultValue={userProfile?.profile?.bio as string}
            {...register("bio")}
          />
          <input
            className="input-bordered  input-primary input w-full "
            placeholder="Location"
            defaultValue={userProfile?.profile?.location as string}
            {...register("location")}
          />
          <input
            className="input-bordered  input-primary input w-full "
            placeholder="Website"
            defaultValue={userProfile?.profile?.website as string}
            {...register("website")}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
