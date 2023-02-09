import { Tweet } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState,useEffect } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { RiCloseLine } from "react-icons/ri";
import ReactTimeAgo from "react-time-ago";
import useOnClickOutside from "../../hooks/useOutsideClick";
import { TweetWithUser } from "../../interface";
import { useReplyModal, useTweetId } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";
import Backdrop from "./Backdrop";
import Button from "./Button";
import Loader from "./Loader";
import MediaTools from "./MediaTools";
import Modal from "./Modal";
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


  const now = new Date();
  const msBetweenDates =
    (tweetReply?.createdAt?.getTime() ?? 0) - now.getTime();

  // 👇️ convert ms to hours                  min  sec   ms
  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
  return (
    <Modal>
      <div
        ref={modalRef}
        className="relative mx-auto max-h-[500px] max-w-xs md:max-w-lg overflow-y-scroll rounded-2xl  bg-base-100 p-4 "
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <IoClose
              className="absolute top-4 left-4 cursor-pointer text-2xl"
              onClick={() => setModal(false)}
            />
            <div className="mt-12 flex items-start gap-x-2 md:gap-x-4">
              <Avatar
                image={tweetReply?.user.image as string}
                width={50}
                height={50}
              />
              <div className="mb-8 flex w-full flex-col">
                <div className="flex items-center gap-x-2">
                  <Link href={`/${tweetReply?.userId}/${tweetReply?.user.name}`} className="text-base md:text-lg truncate cursor-pointer hover:underline font-semibold">
                    {tweetReply?.user.name}
                  </Link>
                  <p className="text-sm truncate text-gray-400">
                    {hoursBetweenDates > 24 ? (
                      <span >
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
            <ReplyForm tweet={tweetReply as unknown as TweetWithUser} />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ReplyModal;
