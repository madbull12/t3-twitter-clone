import React from "react";
import { IoIosLink, IoMdClose } from "react-icons/io";
import { IoShareOutline, IoTrash } from "react-icons/io5";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-hot-toast";
import useBookmark from "../../hooks/useBookmark";
import { FiBookmark } from "react-icons/fi";
const ShareDropdown = ({ tweetId }: { tweetId: string }) => {
  const tablet = useMediaQuery("(min-width:1110px)");
  const {
    createBookmarkLoading,
    handleCreateBookmark,
    handleDeleteBookmark,
    deleteBookmarkLoading,
    isAdded,
    bookmarkAddedState,
  } = useBookmark(tweetId);
  const [value, copy] = useCopyToClipboard();
  return (
    <>
      {tablet ? (
        <div className="dropdown dropdown-top   list-none ">
          <li tabIndex={0}>
            <IoShareOutline />
          </li>
          <ul
            tabIndex={0}
            className="dropdown-content   menu rounded-box w-52 bg-base-100  shadow"
          >
            <li>
              <button
                onClick={() => {
                  toast.success("Tweet url copied to clipboard");
                  copy(`localhost:3000/status/${tweetId}`);
                }}
                className="flex items-center gap-x-2 rounded-xl p-4 font-bold "
              >
                <IoIosLink />

                <a>Copy url to tweet</a>
              </button>
            </li>

            {isAdded || bookmarkAddedState ? (
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
      ) : (
        <>
          <label htmlFor="share">
            <IoShareOutline className="cursor-pointer text-sm text-gray-400" />
          </label>
          <input type="checkbox" id="share" className="modal-toggle" />

          <div className="modal modal-middle  ">
            <div className="modal-box flex flex-col items-center">
              <div className="flex items-center gap-x-2 rounded-xl p-4 font-bold transition-all  duration-100 ease-in-out hover:bg-base-300">
                <IoIosLink />

                <a>Copy url to tweet</a>
              </div>

              <div className="modal-action self-end">
                <label htmlFor="share">
                  <IoMdClose className="text-xl" />
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShareDropdown;
