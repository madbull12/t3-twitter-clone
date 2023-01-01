import React from "react";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "../../hooks/useOutsideClick";
import Backdrop from "./Backdrop";
import { useRef } from "react";
import { useEditProfileModal } from "../../lib/zustand";
import { AiFillCamera } from "react-icons/ai";
import Image from "next/legacy/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import { trpc } from "../utils/trpc";

type Profile = {
    name:string,
    coverPhoto:string,
    image:string,
    bio:string,
    location:string,
    website:string,

}

const EditProfileModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { data:userProfile } = trpc.user.getUserProfile.useQuery({ userId:session?.user?.id as string})
  const { setModal } = useEditProfileModal();

  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Profile>();
  const onSubmit: SubmitHandler<Profile> = data => console.log(data);
  return (
    <Backdrop>
      <div ref={modalRef} className="mx-auto w-1/2 rounded-2xl h-[500px]  bg-white overflow-y-scroll">
        <header className="flex items-center justify-between gap-x-4 p-4">
          <IoMdClose className="text-xl" />
          <p className="mr-auto text-xl font-semibold">Edit profile</p>
          <button className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white sm:text-sm">
            Save
          </button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid h-48 w-full place-items-center bg-gray-200 ">
            <div className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-gray-500 text-3xl text-white transition-all ease-in-out hover:bg-gray-600">
              <AiFillCamera />
            </div>
          </div>
          <div className="relative mx-4 -mt-12 grid h-[100px]  w-[100px]  place-items-center">
            <div className="z-50 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-gray-700 text-xl text-white transition-all ease-in-out hover:bg-gray-800">
              <AiFillCamera />
            </div>
            <Image
              className="rounded-full border-2 border-white"
              alt="profile"
              layout="fill"
              src={session?.user?.image as string}
            />
          </div>
          <div className="flex flex-col gap-y-6 p-2 md:p-4">
            <input
              className="w-full rounded-lg focus:ring-2 focus:ring-blue-500 border border-gray-300 px-4 py-2 outline-none"
              placeholder="Name"
              defaultValue={userProfile?.name as string}
              {...register("name")}

            />
            <input
              className="w-full rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-300 px-4 py-2 outline-none"
              placeholder="Bio"
              defaultValue={userProfile?.profile?.bio as string}
              {...register("bio")}
            />
            <input
              className="w-full rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-300 px-4 py-2 outline-none"
              placeholder="Location"
              defaultValue={userProfile?.profile?.location as string}
              {...register("location")}
            />
            <input
              className="w-full rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-300 px-4 py-2 outline-none"
              placeholder="Website"
              defaultValue={userProfile?.profile?.website as string}
              {...register("website")}
            />
          </div>
        </form>
      </div>
    </Backdrop>
  );
};

export default EditProfileModal;
