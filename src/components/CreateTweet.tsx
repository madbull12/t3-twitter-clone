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
const CreateTweet = () => {
  const { data: session, status } = useSession();
  useEffect(() => {}, []);
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
  // console.log(preview)
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let imageUrl = null;

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

      imageUrl = res.secure_url;
    }

    toast.promise(createTweet({ text, imageUrl }), {
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
  return (
    <div className="mt-4 flex items-start gap-x-4 border-b p-2  ">
      <Avatar image={session?.user?.image || ""} />
      <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
        <textarea
          cols={50}
          ref={textRef}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="text-xl outline-none placeholder:text-gray-600 resize-none w-full overflow-hidden"
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

        <div className=" flex items-center gap-x-2 font-semibold text-primary">
          <RiEarthFill className="text-xl" />
          <p>Everyone can reply</p>
        </div>
        <div className="flex w-full items-center justify-between border-t py-2">
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
