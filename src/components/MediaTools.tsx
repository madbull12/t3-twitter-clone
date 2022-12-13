import React from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";

interface IProps {
  onSelectFile: (e: any) => void;
}
const MediaTools = ({ onSelectFile }: IProps) => {
  return (
    <div className=" flex flex-[0.5] items-center gap-x-4 text-base md:text-lg text-primary">
      <div>
        <input
          className=""
          id="imageSelect"
          hidden
          type="file"
          onChange={onSelectFile}
          accept="image/png, image/gif, image/jpeg,video/mp4,video/x-m4v,video/*"
        />
        <label htmlFor="imageSelect" className="cursor-pointer">
          <AiOutlinePicture />
        </label>
      </div>
      <AiOutlineFileGif />
      <BiPoll />
    </div>
  );
};

export default MediaTools;
