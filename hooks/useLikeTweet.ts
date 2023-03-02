import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TweetWithUser } from "../interface";
import { useLoginModal } from "../lib/zustand";
const useLikeTweet = (tweet: TweetWithUser) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { f, q, userId,statusId,listId } = router.query;
  const utils = trpc.useContext();

  const invalidateLikeQueries = () => {
    if (router.pathname === "/search") {
      utils.tweet.searchTweets.invalidate({
        term: q as string,
        filtering: f as string,
        limit:10
      });
    }
    utils.tweet.getTweets.invalidate();
    utils.like.userLikeTweet.invalidate({ tweetId:tweet?.id });

    utils.tweet.getInfiniteTweets.invalidate();
    if (router.pathname === "/status/[statusId]") {
      utils.tweet.getSingleTweet.invalidate({ tweetId:statusId as string });
      utils.tweet.getTweetReplies.invalidate({ tweetId:statusId as string });
    }
    if (router.pathname === "/[userId]/[username]") {
      utils.tweet.getInfiniteUserTweets.invalidate({
        userId: (userId as string) ?? "",
        link: "",
        limit:10
      });
    }

    if(router.pathname === "/bookmarks") {
      utils.bookmark.getUserBookmarks.invalidate();
    }

    if(router.pathname === "/list/[userId]/[listId]") {
      utils.list.getListDetails.invalidate({ listId:listId as string })
    }

    if(router.pathname === '/following') {
      utils.tweet.getFollowingInfiniteTweets.invalidate()
    }
  }

  const optimizeMutation = () => {
    utils.tweet.getTweets.cancel();
    utils.tweet.getInfiniteTweets.cancel();
    if (router.pathname === "/status/[statusId]") {
      utils.tweet.getTweetReplies.cancel({ tweetId: statusId as string });
      utils.tweet.getSingleTweet.cancel({ tweetId: statusId as string });
    }

    if(router.pathname === "/[userId]/[username]") {
      utils.tweet.getUserTweets.cancel({ userId:userId as string,link:"" })
    }
    if(router.pathname === "/following") {
      utils.tweet.getFollowingInfiniteTweets.cancel();

    }
    if(router.pathname === "/list/[userId]/[listId]") {
      utils.list.getListDetails.cancel({ listId:listId as string })
    }

    const getUserTweets =  utils.tweet.getInfiniteUserTweets.getData({ userId:userId as string,link:"",limit:10 })
    const getTweets = utils.tweet.getTweets.getData();
    const getInfiniteTweets = utils.tweet.getInfiniteTweets.getData();
    const getTweetReplies = utils.tweet.getTweetReplies.getData({
      tweetId: statusId as string,
    });

    const getFollowingInfiniteTweets = utils.tweet.getFollowingInfiniteTweets.getData();
    const getListDetails = utils.list.getListDetails.getData();

    const getSingleTweet = utils.tweet.getSingleTweet.getData({
      tweetId: statusId as string,
    });

    const searchTweets = utils.tweet.searchTweets.getData({
      term: q as string,
      filtering: f as string,
      limit:10
    })

    if (getTweets) {
      utils.tweet.getTweets.setData(getTweets);
    }

    if (getInfiniteTweets) {
      utils.tweet.getInfiniteTweets.setData(getInfiniteTweets);
    }

    if(getTweetReplies) {
      utils.tweet.getTweetReplies.setData(getTweetReplies);

    }
    if(getSingleTweet) {
      utils.tweet.getSingleTweet.setData(getSingleTweet);

    }
    if(searchTweets) {
      utils.tweet.searchTweets.setData(searchTweets);

    }
    if(getUserTweets) {
      utils.tweet.searchTweets.setData(getUserTweets);

    }
    if(getListDetails) {
      utils.list.getListDetails.setData(getListDetails);

    }

    if(getFollowingInfiniteTweets) {
      utils.tweet.getFollowingInfiniteTweets.setData(getFollowingInfiniteTweets)
    }


  }
  
  const { mutateAsync: likeTweet, isLoading: likeLoading } =
    trpc.like.likeTweet.useMutation({
      onMutate: () => {
       optimizeMutation()
      },
      onSettled: () => {
        invalidateLikeQueries()
      },
    });
  const { mutateAsync: unlikeTweet, isLoading: unlikeLoading } =
    trpc.like.unlikeTweet.useMutation({
      onMutate: () => {
        optimizeMutation()
       },
       onSettled: () => {
         invalidateLikeQueries()
       },
    });

    const { mutateAsync:sendNotification } = trpc.notification.sendNotification.useMutation()

  const [hasLiked, setHasLiked] = useState(false);

  const { setModal: setLoginModal } = useLoginModal();

  // const { data: alreadyLiked } = trpc.like.userLikeTweet.useQuery({
  //   tweetId,
  // });



  const handleLike = async () => {
    setHasLiked(true);

    if (status === "authenticated") {
      await toast.promise(likeTweet({ tweetId: tweet.id as string }), {
        success: "Tweet liked",
        loading: "Liking tweet",
        error: (err) => "Oops something went wrong " + err,
      });

      if(session?.user?.id !== tweet.userId) {
        await sendNotification({ text:`${session.user?.name} just liked your tweet`,redirectUrl:`/status/${tweet.id as string}`, recipientId:tweet.userId })

      }

    } else {
      setLoginModal(true);
    }
  };
  const handleUnlike = async () => {
    setHasLiked(false);

    if (status === "authenticated") {
      await toast.promise(unlikeTweet({ tweetId: tweet.id as string }), {
        success: "Tweet unliked",
        loading: "Unliking tweet",
        error: (err) => "Oops something went wrong " + err,
      });
    } else {
      setLoginModal(true);
    }
  };

  return {
    handleLike,
    hasLiked,
    handleUnlike,
    setHasLiked,
    // alreadyLiked,
    likeLoading,
    unlikeLoading,
  };
};

export default useLikeTweet;
