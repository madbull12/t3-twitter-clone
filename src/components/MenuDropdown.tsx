import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiDotsHorizontal } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoTrash } from "react-icons/io5";
import useBookmark from "../../hooks/useBookmark";
import useDeleteTweet from "../../hooks/useDeleteTweet";
import useMediaQuery from "../../hooks/useMediaQuery";
import { TweetWithUser } from "../../interface";
import { trpc } from "../utils/trpc";
import { FiBookmark } from "react-icons/fi";
import useFollow from "../../hooks/useFollow";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

const MenuDropdown = ({ tweet }: { tweet: TweetWithUser }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const { status } = useSession();
  const { handleDeleteTweet } = useDeleteTweet(tweet);


  const {
    handleFollow,
    handleUnfollow,
    followed,
    alreadyFollowed,
    followingUser,
    unfollowingUser,
  } = useFollow(tweet.user.id);

  const isYourTweet = tweet.userId === session?.user?.id;
  //   console.log(isYourTweet);

  const tablet = useMediaQuery("(min-width:1110px)");

  return (
    <>
   
        <div className="dropdown dropdown-bottom dropdown-end ">
          <label tabIndex={0} className=" relative  cursor-pointer ">
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label>

          {isYourTweet ? (
            <ul
              tabIndex={0}
              className="dropdown-content  menu rounded-box absolute  top-0 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <button
                  onClick={handleDeleteTweet}
                  className="flex items-center gap-x-2 font-bold text-red-500"
                >
                  <IoTrash />
                  <a className="">Delete Tweet</a>
                </button>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="dropdown-content dropdown-bottom dropdown-end menu rounded-box absolute top-0 w-52 bg-base-100 p-2 shadow"
            >
              {(alreadyFollowed !== null || followed) &&
              status === "authenticated" ? (
                <li className="">
                  <button
                    disabled={followingUser || unfollowingUser}
                    onClick={() => handleUnfollow()}
                    className="flex items-center gap-x-2 w-[90%]  whitespace-nowrap   font-bold text-red-500"
                  >
                    <RiUserUnfollowLine />
                    <p className="truncate w-full">Unfollow {tweet.user.name}</p>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    disabled={followingUser || unfollowingUser}
                    onClick={() => handleFollow()}
                    className="flex items-center gap-x-2 w-[90%] whitespace-nowrap font-bold"
                  >
                    <RiUserFollowLine />
                    <p className="truncate w-full">Follow {tweet.user.name}</p>
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
        <>
          {/* <label htmlFor="my-modal-6" onClick={handleClick}>
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label> */}

          <>
          

            {/* <div className="modal modal-bottom md:modal-middle">
              <div className="modal-box flex flex-col items-center">
                <h1>{`${isYourTweet}`}</h1>
                {isYourTweet ? (
                  <h3
                    className="text-lg font-bold text-red-500"
                    // onClick={handleDeleteTweet}
                  >
                    Delete
                  </h3>
                ) : (
                  <h3 className="text-lg font-bold ">Bookmark </h3>
                )}

                <div className="modal-action self-end">
                  <label htmlFor="my-modal-6">
                    <IoMdClose className="text-xl" />
                  </label>
                </div>
              </div>
            </div> */}
          </>
        </>
      {/* <div className="dropdown ">
        {tablet ? (
          <label tabIndex={0} className=" relative  cursor-pointer ">
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label>
        ) : (
          <label htmlFor="my-modal-6">
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label>
        )}

        {tablet ? (
          <>
            {isYourTweet ? (
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box absolute  top-0 w-52 bg-base-100 p-2 shadow"
              >
                <li onClick={handleDeleteTweet}>
                  <a className="text-red-500">Delete</a>
                </li>
              </ul>
            ) : (
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box absolute top-0 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <a>Bookmark</a>
                </li>
              </ul>
            )}{" "}
          </>
        ) : (
          <>
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />

            <div
              className="modal modal-bottom md:modal-middle"
              onClick={handleClick}
            >
              <div className="modal-box flex flex-col items-center">
                {isYourTweet ? (
                  <h3
                    className="text-lg font-bold text-red-500"
                    // onClick={handleDeleteTweet}
                  >
                    Delete
                  </h3>
                ) : (
                  <h3 className="text-lg font-bold ">Bookmark</h3>
                )}

                <div className="modal-action self-end">
                  <label htmlFor="my-modal-6">
                    <IoMdClose className="text-xl" />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div> */}
    </>
  );
};

export default MenuDropdown;
