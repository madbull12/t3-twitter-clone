import { Tweet } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState,useEffect } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import ReactTimeAgo from "react-time-ago";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useReplyModal, useTweetId } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";
import Backdrop from "./Backdrop";
import Button from "./Button";
import Loader from "./Loader";
import MediaTools from "./MediaTools";
import TweetComponent from "./TweetComponent";

const ReplyForm = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  const utils = trpc.useContext();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: createReply } = trpc.reply.createReply.useMutation({
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let mediaUrl = null;

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

    toast.promise(createReply({ text, mediaUrl, tweetId }), {
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
    <form className="flex flex-col">
      <div className="flex items-start gap-x-4">
        <Avatar image={session?.user?.image || ""} />
        <textarea
          ref={textRef}
          cols={50}
          rows={6}
          className="w-full resize-none text-xl outline-none"
          placeholder="Tweet your reply"
        />
      </div>
      <div className="flex items-center gap-x-64 ">
        <div className="mr-auto">
          <MediaTools onSelectFile={onSelectFile} />
        </div>

        <Button text="Reply" />
      </div>
    </form>
  );
};

const ReplyModal = () => {
  const { setModal } = useReplyModal();
  const { tweetId } = useTweetId();
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });

  const { data: tweetReply, isLoading } = trpc.tweet.getSingleTweet.useQuery({
    tweetId,
  });

  console.log(tweetReply);

  const now = new Date();
  const msBetweenDates =
    (tweetReply?.createdAt?.getTime() ?? 0) - now.getTime();

  // 👇️ convert ms to hours                  min  sec   ms
  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
  return (
    <Backdrop>
      <div
        ref={modalRef}
        className="relative mx-auto max-w-lg rounded-2xl  bg-white p-4 text-black"
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <IoClose
              className="absolute top-4 left-4 cursor-pointer text-2xl"
              onClick={() => setModal(false)}
            />
            <div className="mt-12 flex items-start gap-x-4">
              <Image
                src={tweetReply?.user.image as string}
                alt={tweetReply?.user.name as string}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="mb-8 flex w-full flex-col">
                <div className="flex items-center gap-x-2">
                  <h1 className="text-lg font-semibold">
                    {tweetReply?.user.name}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {hoursBetweenDates > 24 ? (
                      <span>
                        {moment(tweetReply?.createdAt as Date).format("ll")}
                      </span>
                    ) : (
                      <ReactTimeAgo
                        date={tweetReply?.createdAt as Date}
                        locale="en-US"
                      />
                    )}
                  </p>
                </div>
                <p>{tweetReply?.text}</p>

                <p className="mt-4 flex items-center gap-x-2 text-gray-500">
                  Replying to
                  <span className="text-primary">{tweetReply?.user.name}</span>
                </p>
              </div>
            </div>
            <ReplyForm tweetId={tweetReply?.id as string} />
          </>
        )}
      </div>
    </Backdrop>
  );
};

export default ReplyModal;
