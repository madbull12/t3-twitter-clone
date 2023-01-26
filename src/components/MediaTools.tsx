import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import React, { useState,useEffect,useRef } from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { useReadLocalStorage } from "usehooks-ts";
import useOnClickOutside from "../../hooks/useOutsideClick";
import useMediaQuery from "../../hooks/useMediaQuery";

interface IProps {
  onSelectFile: (e: React.FormEvent<HTMLInputElement>) => void;
  onEmojiSelect: (e: React.FormEvent<HTMLInputElement>) => void;
}
const MediaTools = ({ onSelectFile, onEmojiSelect }: IProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const theme = useReadLocalStorage("theme");
  console.log(theme);
  const phone = useMediaQuery("(min-width:640px)");


  const pickerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(pickerRef,()=>{
    setIsPickerOpen(false)
  })
  useEffect(()=>{
    console.log(isPickerOpen)
  },[isPickerOpen])
  return (
    <div className=" flex flex-[0.5] items-center gap-x-4 text-base text-primary md:text-lg">
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
      {phone ? (
        <div className="relative" >
        <BsEmojiSmile
          className="cursor-pointer"
          onClick={() => setIsPickerOpen(true)}
          
        />

        {isPickerOpen ? (
          <div ref={pickerRef} className="absolute   z-[999999]" onClick={(e)=>e.stopPropagation()}>
            <Picker
              onEmojiSelect={onEmojiSelect}
              data={data}
              theme={theme === "default" ? "light" : "dark"}
            />
          </div>
        ) : null}
      </div>
      ):null}

      

      <AiOutlineFileGif />
      <BiPoll />
    </div>
  );
};

export default MediaTools;
