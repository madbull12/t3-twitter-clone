import React from "react";
import { IoIosLink, IoMdClose } from "react-icons/io";
import { IoShareOutline, IoTrash } from "react-icons/io5";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-hot-toast";
import useBookmark from "../../hooks/useBookmark";
import { FiBookmark } from "react-icons/fi";
import { trpc } from "../utils/trpc";
const ShareDropdown = ({ tweetId }: { tweetId: string }) => {
  const tablet = useMediaQuery("(min-width:1110px)");
  const {
    createBookmarkLoading,
    handleCreateBookmark,
    handleDeleteBookmark,
    deleteBookmarkLoading,
    // isAdded,
    bookmarks,
    bookmarkAddedState,
  } = useBookmark(tweetId);
  const [value, copy] = useCopyToClipboard();
  // const isAdded = bookmarks?.find((bookmark) => bookmark.tweetId === tweetId);
    const { data:bookmarkAdded } = trpc.bookmark.userAlreadyBookmark.useQuery({
      bookmarkId:tweetId as string
    })
  return (
    <>

        <div className="dropdown dropdown-top dropdown-end   list-none  cursor-pointer">
          <li tabIndex={1}>
            <IoShareOutline className="hover:text-primary" />
          </li>
          <ul
            tabIndex={1}
            className="dropdown-content text-sm  menu rounded-box w-52 bg-base-100  shadow"
          >
            <li>
              <button
                onClick={() => {
                  toast.success("Tweet url copied to clipboard");
                  copy(
                    `${
                      process.env.NODE_ENV === "development"
                        ? "localhost:3000"
                        : "t3-twitter-clone-nine.vercel.app"
                    }/status/${tweetId}`
                  );
                }}
                className="flex items-center gap-x-2 rounded-xl p-4 font-bold "
              >
                <IoIosLink />

                <a>Copy url to tweet</a>
              </button>
            </li>

            {bookmarkAdded || bookmarkAddedState ? (
              <li>
                <button
                  disabled={createBookmarkLoading || deleteBookmarkLoading}
                  onClick={() => handleDeleteBookmark()}
                  className="flex items-center gap-x-2 font-bold text-red-500"
                >
                  <IoTrash />
                  <a className="">Delete Bookmark</a>
                </button>
              </li>
            ) : (
              <li>
                <button
                  disabled={createBookmarkLoading || deleteBookmarkLoading}
                  onClick={() => handleCreateBookmark(tweetId)}
                  className="flex items-center gap-x-2 font-bold "
                >
                  <FiBookmark />
                  <a>Bookmark</a>
                </button>
              </li>
            )}
          </ul>
        </div>
   
    </>
  );
};

export default ShareDropdown;
