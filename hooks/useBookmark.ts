import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { TweetWithUser } from "../interface";

const useBookmark = (tweetId?:string) => {
  const router = useRouter();
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
    setAddBookmark(true);
    await toast.promise(createBookmark({ tweetId }), {
      success: "Bookmark created",
      loading: "Creating bookmark",
      error: (err) => "Oops something went wrong " + err,
    });

    router.push(`/bookmarks`);
  };
  const handleDeleteBookmark = async () => {
    setAddBookmark(false);
    await toast.promise(deleteBookmark({ tweetId:tweetId as string }), {
      success: "Bookmark deleted",
      loading: "Deleting bookmark",
      error: (err) => "Oops something went wrong " + err,
    });

  };


  return {isLoading, createBookmarkLoading,deleteBookmarkLoading, bookmarks, handleCreateBookmark,bookmarkAddedState,isAdded,handleDeleteBookmark };
};

export default useBookmark;
