import { Option } from "@prisma/client";
import React from "react";
import { v4 } from "uuid";
import { OptionWithPayload } from "../../interface";
import PollComponent from "./PollComponent";

interface IProps {
  options: OptionWithPayload[];
}
const PollComponentList = ({ options }: IProps) => {
    const totalVotes = options.reduce((acc,cur)=>acc + cur.votes?.length,0);

    

  return (
    <>
      {options?.map((option) => (
        <PollComponent key={v4()} option={option} totalVotes={totalVotes} />
      ))}
    </>
  );
};

export default PollComponentList;
