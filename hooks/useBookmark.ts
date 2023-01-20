import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { TweetWithUser } from "../interface";
import { useLoginModal } from "../lib/zustand";
import { useSession } from "next-auth/react";

const useBookmark = (tweetId?:string) => {
  const router = useRouter();
  const { setModal: setLoginModal } = useLoginModal();

  const { status } = useSession()
  const { data: bookmarks,isLoading } = trpc.bookmark.getUserBookmarks.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: createBookmark,isLoading:createBookmarkLoading } =
    trpc.bookmark.createBookmark.useMutation({
      onMutate: () => {
        utils.bookmark.getUserBookmarks.cancel();
        const optimisticUpdate = utils.bookmark.getUserBookmarks.getData();
        if (optimisticUpdate) {
          utils.bookmark.getUserBookmarks.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.bookmark.getUserBookmarks.invalidate();
      },
    });
  const { mutateAsync: deleteBookmark,isLoading:deleteBookmarkLoading } =
    trpc.bookmark.deleteBookmark.useMutation({
      onMutate: () => {
        utils.bookmark.getUserBookmarks.cancel();
        const optimisticUpdate = utils.bookmark.getUserBookmarks.getData();
        if (optimisticUpdate) {
          utils.bookmark.getUserBookmarks.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.bookmark.getUserBookmarks.invalidate();
      },
    });

  const [bookmarkAddedState, setAddBookmark] = useState(false);
  const isAdded = bookmarks?.find((bookmark) => bookmark.tweetId === tweetId);

  const handleCreateBookmark = async (tweetId: string) => {
    if(status==="authenticated") {
    setAddBookmark(true);

      await toast.promise(deleteBookmark({ tweetId:tweetId as string }), {
        success: "Bookmark deleted",
        loading: "Deleting bookmark",
        error: (err) => "Oops something went wrong " + err,
      });
    router.push(`/bookmarks`);

    }else{
      setLoginModal(true)

    }


  };
  const handleDeleteBookmark = async () => {
    if(status==="authenticated") {
    setAddBookmark(false);

      await toast.promise(deleteBookmark({ tweetId:tweetId as string }), {
        success: "Bookmark deleted",
        loading: "Deleting bookmark",
        error: (err) => "Oops something went wrong " + err,
      });
    }else {
      setLoginModal(true)
    }


  };


  return {isLoading, createBookmarkLoading,deleteBookmarkLoading, bookmarks, handleCreateBookmark,bookmarkAddedState,isAdded,handleDeleteBookmark };
};

export default useBookmark;
