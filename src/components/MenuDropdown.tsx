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

const MenuDropdown = ({ tweet }: { tweet: TweetWithUser }) => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { handleDeleteTweet } = useDeleteTweet(tweet);
  const {
    handleCreateBookmark,
    isAdded,
    bookmarkAddedState,
    handleDeleteBookmark,
  } = useBookmark(tweet.id);

  const isYourTweet = tweet.userId === session?.user?.id;
  //   console.log(isYourTweet);

  const tablet = useMediaQuery("(min-width:1110px)");

  return (
    <>
      {tablet ? (
        <div className="dropdown ">
          <label tabIndex={0} className=" relative  cursor-pointer ">
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label>

          {isYourTweet ? (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box absolute  top-0 w-52 bg-base-100 p-2 shadow"
            >
              <li onClick={handleDeleteTweet}>
                <div className="flex items-center gap-x-2 font-bold text-red-500">
                  <IoTrash />
                  <a className="">Delete Tweet</a>
                </div>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box absolute top-0 w-52 bg-base-100 p-2 shadow"
            >
              {isAdded || bookmarkAddedState ? (
                <li onClick={() => handleDeleteBookmark()}>
                  <div className="flex items-center gap-x-2 font-bold text-red-500">
                    <IoTrash />
                    <a className="">Delete Bookmark</a>
                  </div>
                </li>
              ) : (
                <li onClick={() => handleCreateBookmark(tweet.id)}>
                  <div className="flex items-center gap-x-2 font-bold ">
                    <FiBookmark />
                    <a>Bookmark</a>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      ) : (
        <>
          {/* <label htmlFor="my-modal-6" onClick={handleClick}>
            <BiDotsHorizontal className="text-xl text-gray-400" />
          </label> */}

          <>
            {isYourTweet ? (
              <>
                <label htmlFor="my-modal-7">
                  <BiDotsHorizontal className="cursor-pointer text-xl text-gray-400" />
                </label>
                <input
                  type="checkbox"
                  id="my-modal-7"
                  className="modal-toggle"
                />

                <div className="modal modal-middle  ">
                  <div className="modal-box flex flex-col items-center">
                    <div className="flex items-center gap-x-2 font-bold text-red-500">
                      <IoTrash />
                      <a className=""> Delete Tweet</a>
                    </div>

                    <div className="modal-action self-end">
                      <label htmlFor="my-modal-7">
                        <IoMdClose className="text-xl" />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <label htmlFor="my-modal-6">
                  <BiDotsHorizontal className="text-xl text-gray-400" />
                </label>
                <input
                  type="checkbox"
                  id="my-modal-6"
                  className="modal-toggle"
                />
                <div className="modal modal-middle">
                  <div className="modal-box flex list-none flex-col items-center">
                    {isAdded || bookmarkAddedState ? (
                      <li onClick={() => handleDeleteBookmark()}>
                        <div className="flex items-center gap-x-2 font-bold text-red-500">
                          <IoTrash />
                          <a className=""> Delete Bookmark</a>
                        </div>
                      </li>
                    ) : (
                      <li onClick={() => handleCreateBookmark(tweet.id)}>
                        <div className="flex items-center gap-x-2 font-bold ">
                          <FiBookmark />
                          <a>Bookmark</a>
                        </div>
                      </li>
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
      )}
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
