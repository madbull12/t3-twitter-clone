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
  const { setModal: setLoginModal } = useLoginModal();

  const { mutateAsync: retweet, isLoading: isRetweeting } =
    trpc.tweet.createRetweet.useMutation({
      onMutate: () => {
        utils.tweet.getTweets.cancel();
        const optimisticUpdate = utils.tweet.getTweets.getData();
        if (optimisticUpdate) {
          utils.tweet.getTweets.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        if (router.pathname === "/search") {
          utils.tweet.searchTweets.invalidate();
        }
        utils.tweet.getTweets.invalidate();
        utils.tweet.getInfiniteTweets.invalidate();
        utils.tweet.userAlreadyRetweet.invalidate({
          tweetId: tweetId as string,
        });

        if (router.pathname === "/status/[statusId]") {
          utils.tweet.getSingleTweet.invalidate();
          utils.tweet.getTweetReplies.invalidate();
        }
        if (router.pathname === "/[userId]/[username]") {
          utils.tweet.getUserTweets.invalidate();
        }
      },
    });
  const { mutateAsync: undoRetweet, isLoading: isUndoingRetweet } =
    trpc.tweet.undoRetweet.useMutation({
      onMutate: () => {
        utils.tweet.getTweets.cancel();
        const optimisticUpdate = utils.tweet.getTweets.getData();
        if (optimisticUpdate) {
          utils.tweet.getTweets.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        if (router.pathname === "/search") {
          utils.tweet.searchTweets.invalidate();
        }
        utils.tweet.userAlreadyRetweet.invalidate({
          tweetId: tweetId as string,
        });
        utils.tweet.getTweets.invalidate();
        utils.tweet.getInfiniteTweets.invalidate();
        if (router.pathname === "/status/[statusId]") {
          utils.tweet.getSingleTweet.invalidate();
        }
        if (router.pathname === "/[userId]/[username]") {
          utils.tweet.getUserTweets.invalidate();
        }
      },
    });

  const { data: alreadyRetweeted } = trpc.tweet.userAlreadyRetweet.useQuery({
    tweetId: tweetId as string,
  });
  console.log(alreadyRetweeted);

  // const retweetsMapped = userRetweets?.map((retweet)=>retweet.retweets);
  // const alreadyRetweeted = retweetsMapped?.find((retweet)=>retweet.id)

  const [hasRetweeted, setHasRetweeted] = useState(false);

  const handleRetweet = async () => {
    setHasRetweeted(true);
    if (status === "authenticated") {
      await toast.promise(
        retweet({ tweetId: tweetId as string, text: null, mediaUrl: null }),
        {
          success: "Retweeted",
          loading: "Retweeting tweet",
          error: (err) => "Oops something went wrong " + err,
        }
      );
    } else {
      setLoginModal(true);
    }
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
    isRetweeting,
    isUndoingRetweet,
  };
};

export default useRetweet;
