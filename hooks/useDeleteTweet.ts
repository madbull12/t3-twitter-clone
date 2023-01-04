import { toast } from "react-hot-toast";
import { TweetWithUser } from "../interface";
import { trpc } from "../src/utils/trpc";

const useDeleteTweet = (tweet:TweetWithUser) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();

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

  //   console.log(isYourTweet);
  const handleDeleteTweet = async () => {
    toast.promise(deleteTweet({ tweetId: tweet.id }), {
      success: "Tweet deleted",
      loading: "Deleting tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });
  };

  return { handleDeleteTweet }

}

export default useDeleteTweet;