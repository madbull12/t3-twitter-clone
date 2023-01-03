import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";

const useDeleteTweet = (tweetId:string) => {
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

    return { handleDeleteTweet }
}

export default useDeleteTweet;