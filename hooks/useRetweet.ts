import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { TweetWithUser } from "../interface";
import { useLoginModal } from "../lib/zustand";
import { useSession } from "next-auth/react";

const useRetweet = (tweetId?: string) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { data: bookmarks } = trpc.bookmark.getUserBookmarks.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: retweet } = trpc.tweet.createRetweet.useMutation({
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
  const { mutateAsync: undoRetweet } = trpc.tweet.undoRetweet.useMutation({
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

  const { data: userRetweets } = trpc.tweet.getUserRetweets.useQuery();
  const alreadyRetweeted = userRetweets?.find((tweet) =>
    tweet.retweets.find((retweet) => retweet.id === tweetId)
  );


  const [hasRetweeted, setHasRetweeted] = useState(false);

  const handleRetweet = async () => {
    setHasRetweeted(true);
    await toast.promise(
      retweet({ tweetId: tweetId as string, text: null, mediaUrl: null }),
      {
        success: "Retweeted",
        loading: "Retweeting tweet",
        error: (err) => "Oops something went wrong " + err,
      }
    );

  };
  const handleUndoRetweet = async () => {
    setHasRetweeted(false);
    await toast.promise(undoRetweet({ tweetId: tweetId as string }), {
      success: "Retweed removed",
      loading: "Removing retweet",
      error: (err) => "Oops something went wrong " + err,
    });
  };

  return {
    bookmarks,
    handleRetweet,
    hasRetweeted,
    alreadyRetweeted,
    handleUndoRetweet,
  };
};

export default useRetweet;
