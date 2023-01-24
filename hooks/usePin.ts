import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoginModal } from "../lib/zustand";
import { trpc } from "../src/utils/trpc";
const usePin = (tweetId: string) => {
  const { setModal: setLoginModal } = useLoginModal();
  const { status } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();

  const { mutateAsync: pinTweet } = trpc.tweet.pinTweet.useMutation({
    onMutate: () => {
      utils.tweet.getUserTweets.cancel();
      const optimisticUpdate = utils.tweet.getUserTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getUserTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getInfiniteTweets.invalidate();

      if (router.pathname === "/[userId]/[username]") {
        utils.tweet.getUserTweets.invalidate();
      }
    },
  });
  const { mutateAsync: unpinTweet } = trpc.tweet.unpinTweet.useMutation({
    onMutate: () => {
      utils.tweet.getUserTweets.cancel();
      const optimisticUpdate = utils.tweet.getUserTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getUserTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getInfiniteTweets.invalidate();
      if (router.pathname === "/[userId]/[username]") {
        utils.tweet.getUserTweets.invalidate();
      }
    },
  });
  const [isPinned, setIsPinned] = useState(false);

  const handlePinTweet = async () => {
    if (status === "authenticated") {
      setIsPinned(true);

      await toast.promise(pinTweet({ tweetId: tweetId as string }), {
        success: "Tweet pinned",
        loading: "Pinning tweet",
        error: (err) => "Oops something went wrong " + err,
      });
    } else {
      setLoginModal(true);
    }
  };
  const handleUnpin = async () => {
    if (status === "authenticated") {
      setIsPinned(false);

      await toast.promise(unpinTweet({ tweetId: tweetId as string }), {
        success: "Tweet unpinned",
        loading: "Unpinning tweet",
        error: (err) => "Oops something went wrong " + err,
      });
    } else {
      setLoginModal(true);
    }
  };

  return { handlePinTweet, isPinned, handleUnpin };
};

export default usePin;
