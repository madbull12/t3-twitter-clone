import { Tweet, User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { ITweet } from "../../interface";
import moment from "moment";
import ReactTimeAgo from "react-time-ago";
import { IoAnalyticsOutline } from "react-icons/io5";
import {
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineRetweet,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { useReplyModal, useTweetId } from "../../lib/zustand";
import Avatar from "./Avatar";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";


type TweetWithUser = Prisma.TweetGetPayload<{
  include: {
    user: true;
  };
}>;

interface IProps {
  tweet: TweetWithUser;
}

const TweetComponent = ({ tweet }: IProps) => {
  const now = new Date();
  const msBetweenDates = tweet?.createdAt?.getTime() - now.getTime();
  const router = useRouter()
  // 👇️ convert ms to hours                  min  sec   ms
  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

  // console.log(hoursBetweenDates);

  const { modal, setModal } = useReplyModal();
  const { setTweetId } = useTweetId();

  return (
      <div onClick={()=>router.push(`/status/${tweet.id}`,undefined,{
        shallow:true
      })} className="flex cursor-pointer items-start gap-x-4 p-4 transition-all duration-100 ease-in-out hover:bg-gray-100">
        <Avatar image={tweet.user.image || ""} />
        <div className="flex w-full  flex-col">
          <div className="flex items-center gap-x-2">
            <h1 className="text-lg font-semibold">{tweet?.user.name}</h1>
            <p className="text-sm text-gray-400">
              {hoursBetweenDates > 24 ? (
                <span>{moment(tweet.createdAt as Date).format("ll")}</span>
              ) : (
                <ReactTimeAgo date={tweet.createdAt as Date} locale="en-US" />
              )}
            </p>
          </div>
          <p>{tweet?.text}</p>

          {tweet?.image ? (
            <div className="relative  h-96 w-3/4">
              {tweet?.image.includes("video") ? (
                <video controls className="relative h-full w-full rounded-2xl">
                  <source src={tweet?.image} type="video/mp4"></source>
                </video>
              ) : (
                <Image
                  objectFit="cover"
                  alt={tweet?.text ?? ""}
                  src={tweet?.image}
                  className="rounded-2xl"
                  layout="fill"
                />
              )}
            </div>
          ) : null}
          <div className="flex  items-center justify-between">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setModal(true);
                setTweetId(tweet.id);
              }}
              className="group cursor-pointer rounded-full  p-2 hover:bg-blue-50"
            >
              <AiOutlineComment className="group-hover:text-primary" />
            </div>
            <div className="group cursor-pointer rounded-full  p-2 hover:bg-blue-50">
              <AiOutlineHeart className="group-hover:text-primary" />
            </div>
            <div className="group cursor-pointer rounded-full  p-2 hover:bg-blue-50">
              <AiOutlineRetweet className="group-hover:text-primary" />
            </div>
            <div className="group cursor-pointer rounded-full  p-2 hover:bg-blue-50">
              <AiOutlineShareAlt className="group-hover:text-primary" />
            </div>
            <div className="group cursor-pointer rounded-full  p-2 hover:bg-blue-50">
              <IoAnalyticsOutline className="group-hover:text-primary" />
            </div>
          </div>
        </div>
      </div>
  );
};

export default TweetComponent;
