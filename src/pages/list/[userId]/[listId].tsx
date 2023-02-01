import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { IoIosLink } from "react-icons/io";
import { IoShareOutline } from "react-icons/io5";
import { useCopyToClipboard } from "usehooks-ts";
import { TweetWithUser } from "../../../../interface";
import { useEditListModal } from "../../../../lib/zustand";
import Avatar from "../../../components/Avatar";
import Body from "../../../components/Body";
import Loader from "../../../components/Loader";
import NavFeed from "../../../components/NavFeed";
import TweetList from "../../../components/TweetList";
import { trpc } from "../../../utils/trpc";

const ListDetails = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { listId, userId } = router.query;
  const { setModal } = useEditListModal();
  const [value, copy] = useCopyToClipboard();
  const utils = trpc.useContext()
  const [followed, setFollowed] = useState<boolean>();

  const { mutateAsync: followList,isLoading:followLoading } = trpc.follow.followList.useMutation({
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
  const { mutateAsync: unfollowList,isLoading:unfollowLoading } = trpc.follow.unfollowList.useMutation(
    {
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
    }
  );

  const handleFollowList = async () => {
    setFollowed(true);
    await toast.promise(
      followList({
        userId: session?.user?.id as string,
        listId: listId as string,
      }),
      {
        loading: "Following  list",
        success: "List followed",
        error: (err) => `Oops... something went wrong ` + err,
      }
    );
  };
  const handleUnfollowList = async () => {
    setFollowed(false);
    await toast.promise(
      unfollowList({
        userId: session?.user?.id as string,
        listId: listId as string,
      }),
      {
        loading: "Unfollowing  list",
        success: "List unfollowed",
        error: (err) => `Oops... something went wrong ` + err,
      }
    );
  };

  const { data: listDetails, isLoading } = trpc.list.getListDetails.useQuery({
    listId: listId as string,
  });
  const followExist = listDetails?.followers.find(
    (follower) => follower.id === session?.user?.id
  );

  const { data: tweetsByList } = trpc.list.getTweetsByListMembers.useQuery({
    listId: listId as string,
  });
  if (isLoading) return <Loader />;
  return (
    <Body>
      <NavFeed
        title={listDetails?.name ?? ""}
        subtitle={`${
          listDetails?.creator.handle ? `@${listDetails?.creator.handle}` : ""
        }`}
      >
        <div className="absolute top-3 right-0">
          <div className="dropdown-bottom dropdown-end dropdown">
            <label
              tabIndex={0}
              className="btn m-1 border-none  bg-transparent text-neutral hover:bg-transparent"
            >
              <IoShareOutline className="cursor-pointer text-2xl " />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 font-bold shadow"
            >
              <li>
                <button
                  onClick={() => {
                    toast.success("List link copied to clipboard");

                    copy(
                      `${
                        process.env.NODE_ENV === "development"
                          ? "localhost:3000"
                          : "t3-twitter-clone-nine.vercel.app"
                      }/list/${userId}/${listId}`
                    );
                  }}
                  className="flex items-center gap-x-2 rounded-xl p-2 font-bold "
                >
                  <IoIosLink />

                  <a>Copy link to list</a>
                </button>
              </li>
            </ul>
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
      <div className="my-4 flex flex-col items-center gap-y-4">
        <p className="font-bold">{listDetails?.name}</p>
        {listDetails?.description ? <p>{listDetails?.description}</p> : null}
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
          <p>
            {listDetails?.members.length}{" "}
            <span className="text-gray-500"> Members</span>
          </p>
          <p>
            {listDetails?.followers.length}{" "}
            <span className="text-gray-500">Followers</span>{" "}
          </p>
        </div>
        {listDetails?.creatorId === session?.user?.id ? (
          <button
            onClick={() => setModal(true)}
            className="rounded-full border border-base-300 bg-transparent px-4 py-2 font-semibold hover:bg-base-200"
          >
            Edit List
          </button>
        ) : (
          <>
            {followExist || followed ? (
              <button
                onClick={handleUnfollowList}
                disabled={unfollowLoading || followLoading}
                className=" border-red-600 border rounded-full px-4 py-2 font-semibold "
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollowList}
                disabled={unfollowLoading || followLoading}
                className="rounded-full bg-primary px-4 py-2 font-semibold "
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
      <TweetList tweets={tweetsByList as TweetWithUser[]} />
    </Body>
  );
};

export default ListDetails;
