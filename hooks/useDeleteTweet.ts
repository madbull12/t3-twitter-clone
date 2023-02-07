import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { TweetWithUser } from "../interface";
import { trpc } from "../src/utils/trpc";

const useDeleteTweet = (tweet: TweetWithUser) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();
  const router = useRouter();
  const { q,f,statusId } = router.query

  const invalidateAllTweetQueries = () => {
    
  }
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
      utils.tweet.getInfiniteTweets.invalidate();
      if (router.pathname === "/status/[statusId]") {
        utils.tweet.getTweetReplies.invalidate({ tweetId:statusId as string });
        utils.tweet.getSingleTweet.invalidate({ tweetId:statusId as string });
      } 
      if (router.pathname === "/search") {
        utils.tweet.searchTweets.invalidate({ term:q as string,filtering:f as string });
      }
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

  return { handleDeleteTweet };
};

export default useDeleteTweet;
