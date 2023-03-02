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
  const utils = trpc.useContext();
  const { setModal: setLoginModal } = useLoginModal();
  const { userId,statusId,f, q,listId } = router.query;

  const invalidateRetweetQueries = () => {
    if (router.pathname === "/search") {
      utils.tweet.searchTweets.invalidate({
        term: q as string,
        filtering: f as string,
        limit:10
      });
    }
    utils.tweet.getTweets.invalidate();
    utils.tweet.userAlreadyRetweet.invalidate({
      tweetId: tweetId as string,
    });
    utils.tweet.getInfiniteTweets.invalidate();
    if (router.pathname === "/status/[statusId]") {
      utils.tweet.getSingleTweet.invalidate({ tweetId:statusId as string });
      utils.tweet.getTweetReplies.invalidate({ tweetId:statusId as string });
    }
    if (router.pathname === "/[userId]/[username]") {
      utils.tweet.getUserTweets.invalidate({
        userId: (userId as string) ?? "",
        link: "",
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

    const getUserTweets =  utils.tweet.getInfiniteUserTweets.getData({ userId:userId as string,link:"",limit:10})
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

  const { mutateAsync: retweet, isLoading: isRetweeting } =
    trpc.tweet.createRetweet.useMutation({
      onMutate: () => {
        optimizeMutation()
        
      },
      onSettled: () => {
        invalidateRetweetQueries()
      },
    });
  const { mutateAsync: undoRetweet, isLoading: isUndoingRetweet } =
    trpc.tweet.undoRetweet.useMutation({
      onMutate: () => {
        optimizeMutation()
        
      },
      onSettled: () => {
        invalidateRetweetQueries()
      },
    });

  // const { data: alreadyRetweeted } = trpc.tweet.userAlreadyRetweet.useQuery({
  //   tweetId: tweetId as string,
  // },{
  //   onSettled:()=>{
  //     utils.tweet.userAlreadyRetweet.cancel({ tweetId:tweetId as string });
  //   }
  // });

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
    handleRetweet,
    hasRetweeted,
    // alreadyRetweeted,
    handleUndoRetweet,
    isRetweeting,
    isUndoingRetweet,
  };
};

export default useRetweet;
