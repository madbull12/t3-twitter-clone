import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-hot-toast";
import { BiDotsHorizontal } from "react-icons/bi";
import { trpc } from "../utils/trpc";

const MenuDropdown = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();
  const { data: userTweets } = trpc.tweet.getUserTweets.useQuery({
    userId: session?.user?.id as string,
    link: "tweets&replies",
  });

  const { mutateAsync: deleteTweet } = trpc.tweet.deleteTweet.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getTweets.invalidate();
    },
  });

  const isYourTweet = !!userTweets?.find((tweet) => tweet.id === tweetId);
  console.log(isYourTweet);
  const handleDeleteTweet = async () => {
    toast.promise(deleteTweet({ tweetId }), {
      success: "Tweet deleted",
      loading: "Deleting tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });
  };

  return (
    <div className="dropdown ">
      <label tabIndex={0} className=" cursor-pointer  relative ">
        <BiDotsHorizontal className="text-xl text-gray-400" />
      </label>
      {isYourTweet ? (
        <ul
          tabIndex={0}
          className="dropdown-content menu absolute top-0  rounded-box w-52 bg-base-100 p-2 shadow"
        >
          <li onClick={handleDeleteTweet}>
            <a className="text-red-500">Delete</a>
          </li>
    
        </ul>
      ) : (
        <ul
          tabIndex={0}
          className="dropdown-content absolute top-0 menu rounded-box w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <a>Bookmark</a>
          </li>
  
        </ul>
      )}
    </div>
  );
};

export default MenuDropdown;
