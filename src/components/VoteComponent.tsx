import { Option } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { OptionWithPayload } from "../../interface";
import { useLoginModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";

interface IProps {
  option: OptionWithPayload;
  totalVotes: number;
}
const VoteComponent = ({ option, totalVotes }: IProps) => {
  // console.log(option.votes / totalVotes)
  const { setModal:setLoginModal } = useLoginModal()
  const utils = trpc.useContext();
  const router = useRouter();
  const { statusId } = router.query;
  const { data: session,status } = useSession();
  const { mutateAsync: votePoll } = trpc.vote.voteOption.useMutation({
    onMutate: () => {
      utils.tweet.getInfiniteTweets.cancel();
      const optimisticUpdate = utils.tweet.getInfiniteTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getInfiniteTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      if (router.pathname === "") {
        utils.tweet.getInfiniteTweets.invalidate();
      } else if (router.pathname === "/status/[statusId]") {
        utils.tweet.getSingleTweet.invalidate({ tweetId: statusId as string });
      }
    },
  });

  const handleVote = async () => {
    if(status === "authenticated") {
      await toast.promise(
        votePoll({ userId: session?.user?.id as string, optionId: option.id }),
        {
          loading: "Voting poll",
          success: "Poll voted",
          error: (err) => `Oops something went wrong ${err}`,
        }
      );
    } else {
      setLoginModal(true)
    }

  };

  const votePercentage = (option.votes.length / totalVotes || 0) * 100;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleVote();
      }}
      className="w-full cursor-pointer gap-x-3 font-semibold  rounded-md border  border-gray-600"
    >
      <div
        style={{ width: `${votePercentage}%` }}
        className={`h-8 text-neutral flex items-center justify-between rounded-md  bg-blue-400 px-2 text-sm transition-all duration-100 ease-linear `}
      >
        <p>{option?.text}</p>
        {votePercentage >= 10 ? <p>{votePercentage.toFixed(0)}%</p> : null}
      </div>
    </div>
  );
};

export default VoteComponent;
