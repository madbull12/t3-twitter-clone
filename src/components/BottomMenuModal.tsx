import React from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { trpc } from "../utils/trpc";

const BottomMenuModal = ({ tweetId }: { tweetId: string }) => {
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
    }
  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col items-center">
        <h3 className="text-lg font-bold text-red-500" onClick={handleDeleteTweet}>
          Delete
        </h3>
      
        <div className="modal-action self-end">
          <label htmlFor="my-modal-6" >
            <IoMdClose className="text-xl" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BottomMenuModal;
