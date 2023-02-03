import { Option } from "@prisma/client";
import React from "react";

interface IProps {
  option: Option;
}
const PollComponent = ({ option }: IProps) => {
  return (
    <div className={`h-8 px-2 text-sm flex items-center w-[25%] rounded-md bg-gray-400`}>
      <p className="text-black">{option?.text}</p>
    </div>
  );
};

export default PollComponent;
