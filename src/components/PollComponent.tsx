import { Option } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-hot-toast";
import { OptionWithPayload } from "../../interface";
import { trpc } from "../utils/trpc";

interface IProps {
  option: OptionWithPayload;
  totalVotes:number;
}
const PollComponent = ({ option,totalVotes }: IProps) => {
  // console.log(option.votes / totalVotes)

  const { data:session } = useSession()
  const { mutateAsync:votePoll } = trpc.vote.voteOption.useMutation({

  })

  const handleVote = async() => {
    await toast.promise(votePoll({ userId:session?.user?.id as string,optionId:option.id }),{
      loading:"Voting poll",
      success:"Poll voted",
      error:(err)=>`Oops something went wrong ${err}`
    })
  }

  const votePercentage = (option.votes.length / totalVotes || 0) * 100
  return (
    <div onClick={(e)=>{
      e.stopPropagation()
      handleVote()
    }} className="w-full rounded-md border border-gray-600 gap-x-3">
    <div style={{ width:`${votePercentage}%` }}  className={`h-8 ${votePercentage <= 10 ? "text-white" : "text-black"} px-2 text-sm flex items-center  rounded-md bg-gray-400 justify-between`}>
      <p >{option?.text}</p>
      {votePercentage >= 10 ? <p>{votePercentage}%</p> : null}
    </div>
    </div>

  );
};

export default PollComponent;
