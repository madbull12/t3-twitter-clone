import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";

const useBookmark = () => {
    const  router = useRouter()
  const { data: bookmarks } = trpc.bookmark.getUserBookmarks.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: createBookmark } = trpc.bookmark.createBookmark.useMutation({
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

  const handleCreateBookmark = async (tweetId: string) => {
    await toast.promise(createBookmark({ tweetId }), {
        success:"Bookmark created",
        loading:'Creating bookmark',
        error:(err)=>"Oops something went wrong " + err
    });

     router.push(`/bookmarks`)
  };

  return { bookmarks, handleCreateBookmark };
};

export default useBookmark;
