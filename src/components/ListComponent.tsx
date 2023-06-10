import { List } from "@prisma/client";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React from "react";
import { ListWithPayloads } from "../../interface";
import Avatar from "./Avatar";
import { AiFillLock } from "react-icons/ai";

const ListComponent = ({ list }: { list: ListWithPayloads }) => {
  const router = useRouter();
  console.log(list);
  return (
    <div
      className="flex cursor-pointer items-center gap-x-4 p-4 hover:bg-base-200"
      onClick={() => router.push(`/list/${list.creatorId}/${list.id}`)}
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-400">
        {list.coverPhoto ? (
          <Image
            objectFit="cover"
            layout="fill"
            src={list.coverPhoto ?? ("" as string)}
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-bold sm:text-base">{list.name}</p>
          {list.isPrivate ? <AiFillLock /> : null}

          {list.members.length !== 0 ? (
            <>
              <div className="h-1 w-1 rounded-full bg-stone-500"></div>
              <p className="text-xs">{list.members?.length} members</p>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-x-1 text-xs xs:text-sm">
          <Avatar
            height={15}
            width={15}
            image={list?.creator.image || ("" as string)}
          />
          <p className="font-semibold">{list.creator.name}</p>
          {list.creator.handle ? (
            <p className="text-gray-500">@{list.creator.handle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
