import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFileGif, AiOutlinePicture } from "react-icons/ai";
import { RiCloseLine, RiEarthFill } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";
import Button from "./Button";
import Image from "next/image";
import { usePreviewStore } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";
import MediaTools from "./MediaTools";
import Avatar from "./Avatar";
import Link from "next/link";
// import { useForm } from "react-hook-form";
// import useCreateTweet from "../../hooks/useCreateTweet";
// import useMediaUpload from "../../hooks/useMediaUpload";

const CreateTweet = () => {
  const { data: session, status } = useSession();
  const utils = trpc.useContext();

  const { mutateAsync: createTweet } = trpc.tweet.createTweet.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getTweets.invalidate();
    },
  });
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  const [text, setText] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  // console.log(selectedFile);
  // console.log(text.split(" ").filter((word)=>word.startsWith("#")).map((word)=>word.slice(1)))
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let mediaUrl = null;
    let hashtags = text
      .split(" ")
      .filter((word) => word.startsWith("#"))
      .map((word) => word.slice(1));

    //upload image
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "xap2a5k4");
      // formData.append("file", );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dem2vt6lj/${
          selectedFile.type === "video/mp4" ? "video" : "image"
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      mediaUrl = res.secure_url;
    }

    toast.promise(createTweet({ text, mediaUrl, hashtags }), {
      success: "Tweet created",
      loading: "Creating tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });

    textRef!.current!.value = "";
    setSelectedFile(undefined);
  };
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

  // const {
  //   // upload: imageUpload,
  //   onSelectFile,
  //   preview,
  //   selectedFile,
  //   setSelectedFile,
  //   // mediaUrl:imageUrl
  // } = useMediaUpload();
  // const { handleSubmit,textRef,setText } = useCreateTweet()

  return (
    <div className="mt-4 flex items-start gap-x-4 border-b border-base-300 p-2  ">
      <Link href={`/${session?.user?.id}/${session?.user?.name}`} className="cursor-pointer">
        <Avatar image={session?.user?.image || ""} width={40} height={40} />
      </Link>
      <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
        <textarea
          cols={50}
          ref={textRef}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className={`w-full resize-none overflow-hidden bg-transparent text-neutral outline-none placeholder:text-gray-600 md:text-xl `}
        />
        {selectedFile && (
          <>
            {selectedFile.type === "video/mp4" ? (
              <video controls className="relative h-full w-full rounded-2xl">
                <source src={preview} type="video/mp4"></source>
              </video>
            ) : (
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
          </>
        )}

        <div className=" flex items-center gap-x-2 text-sm font-semibold text-primary md:text-base">
          <RiEarthFill className="text-xl" />
          <p>Everyone can reply</p>
        </div>
        <div className="flex w-full items-center border-t border-base-300 py-2">
          {/* <div className="mx-auto flex flex-[0.6] items-center gap-x-4 text-lg text-primary">
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
            
          </div> */}
          <MediaTools onSelectFile={(e: any) => onSelectFile(e)} />
          <div className="flex-[0.4]">
            <Button text="Tweet" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTweet;
