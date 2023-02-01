import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React from "react";
import { UserWithPayloads } from "../../interface";
import { useEditListModal } from "../../lib/zustand";

const ListMember = ({ member }: { member: UserWithPayloads }) => {
  const router = useRouter();
  const { setModal } = useEditListModal();
  return (
    <div
      className="flex cursor-pointer items-center gap-x-4 rounded-lg py-2 px-4 hover:bg-base-200"
      onClick={() => {
        router.push(`/${member.id}/${member.name}`);
        setModal(false)
      }}
    >
      <Image
        src={member.image as string}
        objectFit="cover"
        width={50}
        height={50}
        className="rounded-lg"
      />
      <div className="mr-auto flex flex-col gap-y-3">
        <p>{member.name}</p>
        {member.handle ? (
          <p className="text-sm text-gray-500">@{member.handle}</p>
        ) : null}
        <p>{member?.profile?.bio}</p>
      </div>
      <button className="rounded-full bg-primary px-4 py-2">Add</button>
    </div>
  );
};

export default ListMember;
