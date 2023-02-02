import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { UserWithPayloads } from "../../interface";
import { useEditListModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";

const ListMember = ({ member }: { member: UserWithPayloads }) => {
  const router = useRouter();
  const { setModal } = useEditListModal();
  const utils = trpc.useContext();
  const { listId } = router.query;

  const { data: memberExist } = trpc.list.isMemberExist.useQuery({
    listId: listId as string,
    memberId: member.id,
  });


  const { mutateAsync: addMember } = trpc.list.addMember.useMutation({
    onMutate: () => {
      utils.list.getListDetails.cancel();
      const optimisticUpdate = utils.list.getListDetails.getData();
      if (optimisticUpdate) {
        utils.list.getListDetails.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.list.getListDetails.invalidate({
        listId: listId as string,
      });
      utils.list.isMemberExist.invalidate({
        listId: listId as string,
        memberId: member.id,
      });
    },
  });
  const { mutateAsync: removeMember } = trpc.list.removeMember.useMutation({
    onMutate: () => {
      utils.list.getListDetails.cancel();
      const optimisticUpdate = utils.list.getListDetails.getData();
      if (optimisticUpdate) {
        utils.list.getListDetails.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.list.getListDetails.invalidate({
        listId: listId as string,
      });
      utils.list.isMemberExist.invalidate({
        listId: listId as string,
        memberId: member.id,
      });
    },
  });

  const [isAdded, setIsAdded] = useState(false);

  const handleAddMember = async () => {
    setIsAdded(true);
    setModal(false);

    await toast.promise(
      addMember({ userId: member.id, listId: listId as string }),
      {
        loading: `Adding ${member.name}`,
        success: `${member.name} added`,
        error: (err) => `Oops something went wrong ${err}`,
      }
    );
  };
  const handleRemoveMember = async () => {
    setIsAdded(false);
    setModal(false);

    await toast.promise(
      removeMember({ userId: member.id, listId: listId as string }),
      {
        loading: `Removing ${member.name}`,
        success: ` ${member.name} removed`,
        error: (err) => `Oops something went wrong ${err}`,
      }
    );
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-x-4 rounded-lg py-2 px-4 hover:bg-base-200"
      onClick={() => {
        router.push(`/${member.id}/${member.name}`);
        setModal(false);
      }}
    >
      <Image
        src={member.image as string}
        objectFit="cover"
        width={50}
        height={50}
        className="rounded-lg"
      />
      <div className="mr-auto flex flex-col ">
        <p>{member.name}</p>
        {member.handle ? (
          <p className="text-sm text-gray-500">@{member.handle}</p>
        ) : null}
        <p className="text-sm">{member?.profile?.bio}</p>
      </div>
      {memberExist || isAdded ? (
        <button
          className="rounded-full bg-red-600 px-4 py-2 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveMember();
          }}
        >
          Remove
        </button>
      ) : (
        <button
          className="rounded-full bg-primary px-4 py-2 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleAddMember();
          }}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default ListMember;
