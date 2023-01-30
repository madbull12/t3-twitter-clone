import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React from "react";
import { IoShareOutline } from "react-icons/io5";
import { useEditListModal } from "../../../../lib/zustand";
import Avatar from "../../../components/Avatar";
import Body from "../../../components/Body";
import Loader from "../../../components/Loader";
import NavFeed from "../../../components/NavFeed";
import { trpc } from "../../../utils/trpc";

const ListDetails = () => {
  const router = useRouter();
  const { listId,userId } = router.query;
  const { setModal } = useEditListModal();

  const { data: listDetails,isLoading } = trpc.list.getListDetails.useQuery({
    listId: listId as string,
  });
  if(isLoading) return <Loader />
  return (
    <Body>
      <NavFeed
        title={listDetails?.name ?? ""}
        subtitle={`${
          listDetails?.creator.handle ? `@${listDetails?.creator.handle}` : ""
        }`}
      >
        <div className="absolute top-3 right-0">
          <div className="absolute top-2 right-4">
            <IoShareOutline className="cursor-pointer text-2xl " />
          </div>
        </div>
      </NavFeed>
      <div className="relative grid h-32 w-full place-items-center bg-gray-200 xs:h-36 sm:h-44 lg:h-48 ">
        {listDetails?.coverPhoto ? (
          <Image
            layout="fill"
            src={listDetails?.coverPhoto}
            objectFit="cover"
          />
        ) : null}
      </div>
      <div className="mt-4 flex flex-col items-center gap-y-4">
        <p className="font-bold">{listDetails?.name}</p>
        {listDetails?.description ? (
        <p >{listDetails?.description}</p>

        ):null}
        <div className="flex items-center gap-x-1 text-xs xs:text-sm">
          <Avatar
            height={20}
            width={20}
            image={listDetails?.creator.image || ("" as string)}
          />
          <p className="font-semibold">{listDetails?.creator.name}</p>
          {listDetails?.creator.handle ? (
            <p className="text-gray-500">@{listDetails?.creator.handle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-x-4">
          <p>{listDetails?.members.length} <span className="text-gray-500"> Members</span></p>
          <p>{listDetails?.followers.length} <span className="text-gray-500">Followers</span> </p>
        </div>
        {listDetails?.creatorId === userId ?(
          <button onClick={()=>setModal(true)} className="font-semibold px-4 py-2 bg-transparent rounded-full hover:bg-base-200 border border-base-300">Edit Profile</button>
        ):(
          <button className="font-semibold px-4 py-2 bg-primary text-white">Follow</button>
        )}
      </div>
    </Body>
  );
};

export default ListDetails;
