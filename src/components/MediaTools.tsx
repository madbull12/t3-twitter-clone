import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { useReadLocalStorage } from "usehooks-ts";
import useOnClickOutside from "../../hooks/useOutsideClick";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useDisableTweet, useOpenPolling } from "../../lib/zustand";
import { useRouter } from "next/router";

interface IProps {
  onSelectFile: (e: React.FormEvent<HTMLInputElement>) => void;
  onEmojiSelect: (e: React.FormEvent<HTMLInputElement>) => void;
  selectedFile?:File | undefined;
}
const MediaTools = ({ onSelectFile, onEmojiSelect,selectedFile }: IProps) => {
  console.log(selectedFile)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const theme = useReadLocalStorage("theme");
  const phone = useMediaQuery("(min-width:640px)");
  const router = useRouter()

  const { setIsOpen, isOpen: isPollingOpen } = useOpenPolling();

  const pickerRef = useRef<HTMLButtonElement>(null);
  useOnClickOutside(pickerRef, () => {
    setIsPickerOpen(false);
  });

  return (
    <div className=" flex flex-[0.5] items-center gap-x-4 text-base text-primary md:text-lg">
      {!isPollingOpen ? (
        <button type="button">
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
        </button>
      ) : null}

      {phone ? (
        <div className="relative">
          <BsEmojiSmile
            className="cursor-pointer"
            onClick={() => setIsPickerOpen(true)}
          />

          {isPickerOpen ? (
            <button
              ref={pickerRef}
              className="absolute   z-[999999]"
              onClick={(e) => e.stopPropagation()}
              type="button"
            >
              <Picker
                onEmojiSelect={onEmojiSelect}
                data={data}
                theme={theme === "default" ? "light" : "dark"}
              />
            </button>
          ) : null}
        </div>
      ) : null}

      <AiOutlineFileGif />
      {(router.pathname === "/status/[statusId]" || selectedFile !== undefined ) ? (
        null
      ):(
        <button type="button" onClick={() => setIsOpen(true)}>
        <BiPoll className="cursor-pointer" />
      </button>
      )}
 
    </div>
  );
};

export default MediaTools;
