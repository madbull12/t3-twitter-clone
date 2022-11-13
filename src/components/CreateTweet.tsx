import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { RiEarthFill } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";
import Button from "./Button";

const CreateTweet = () => {
  const { data: session, status } = useSession();

  return (
      <div className="mt-4 flex gap-x-4 border-b p-2  ">
        <div className="h-14 w-14 rounded-full bg-primary "></div>
        <form className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="What's happening?"
            className="text-xl outline-none placeholder:text-gray-600"
          />
          <div className=" flex items-center gap-x-2 font-semibold text-primary">
            <RiEarthFill className="text-xl" />
            <p>Everyone can reply</p>
          </div>
          <div className="flex w-full items-center justify-between border-t py-2">
            <div className="mx-auto flex flex-[0.6] items-center gap-x-4 text-lg text-primary">
              <AiOutlinePicture />
              <AiOutlineFileGif />
              <BiPoll />
            </div>
            <div className="flex-[0.4]">
              <Button text="Tweet" />
            </div>
          </div>
        </form>
      </div>
  );
};

export default CreateTweet;
