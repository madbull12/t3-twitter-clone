import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TweetWithUser } from "../interface";
import { useLoginModal } from "../lib/zustand";
const useLikeTweet = (tweetId:string) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const utils = trpc.useContext();
    const { mutate: likeTweet } = trpc.like.likeTweet.useMutation({
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
    const { mutate: unlikeTweet } = trpc.like.unlikeTweet.useMutation({
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
    const [hasLiked, setHasLiked] = useState(false);
  
  
    const {  setModal:setLoginModal } = useLoginModal()

  
    const { data: alreadyLiked } = trpc.like.userLikeTweet.useQuery({
      tweetId,
    });
  
    const handleLike = (e: React.SyntheticEvent) => {
      e.stopPropagation();
  
      if (status === "authenticated") {
        toast.success(alreadyLiked !== null ? "Tweet unliked" : "Tweet liked");
        alreadyLiked !== null
          ? unlikeTweet({ tweetId })
          : likeTweet({ tweetId });
      } else {
        setLoginModal(true);
      }
    };

    return { handleLike, hasLiked,setHasLiked,alreadyLiked }
}

export default useLikeTweet