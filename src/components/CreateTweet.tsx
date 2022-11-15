import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { RiCloseLine, RiEarthFill } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";
import Button from "./Button";
import Image from "next/image";
import { usePreviewStore } from "../../lib/zustand";
import { trpc } from "../utils/trpc";

const CreateTweet = () => {
  const { data: session, status } = useSession();
  const { mutateAsync:createTweet } = trpc.tweet.createTweet.useMutation();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();
  const [text,setText] = useState("");

  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault()
    createTweet({ text })
  }
  console.log(selectedFile)
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  return (
    <div className="mt-4 flex items-start gap-x-4 border-b p-2  ">
      <Image
        alt="profile-image"
        className="rounded-full"
        src={session?.user?.image || ""}
        width={40}
        height={40}
      />
      <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e)=>setText(e.target.value)}
          placeholder="What's happening?"
          className="text-xl outline-none placeholder:text-gray-600"
        />
        {selectedFile && (
          <div className="relative">
            <img src={preview} />
            <div
              onClick={() => setSelectedFile(undefined)}
              className="absolute top-4 right-4  grid h-8 w-8  cursor-pointer  place-items-center rounded-full bg-[#00000083] text-xl text-white"
            >
              <RiCloseLine />
            </div>
          </div>
        )}

        <div className=" flex items-center gap-x-2 font-semibold text-primary">
          <RiEarthFill className="text-xl" />
          <p>Everyone can reply</p>
        </div>
        <div className="flex w-full items-center justify-between border-t py-2">
          <div className="mx-auto flex flex-[0.6] items-center gap-x-4 text-lg text-primary">
            <div>
              <input
                className=""
                id="imageSelect"
                hidden
                type="file"
                onChange={onSelectFile}
                accept="image/png, image/gif, image/jpeg"
              />
              <label htmlFor="imageSelect" className="cursor-pointer">
                <AiOutlinePicture />
              </label>
            </div>
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
