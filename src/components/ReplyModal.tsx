import { Tweet } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState,useEffect } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { RiCloseLine } from "react-icons/ri";
import ReactTimeAgo from "react-time-ago";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { useReplyModal, useTweetId } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";
import Backdrop from "./Backdrop";
import Button from "./Button";
import Loader from "./Loader";
import MediaTools from "./MediaTools";
import ReplyForm from "./ReplyForm";
import TweetComponent from "./TweetComponent";



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
        className="relative mx-auto max-w-lg rounded-2xl overflow-y-scroll max-h-[500px]  bg-white p-4 text-black"
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
