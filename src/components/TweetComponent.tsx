import { Tweet, User } from "@prisma/client";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { OptionWithPayload, TweetWithUser } from "../../interface";
import moment from "moment";
import ReactTimeAgo from "react-time-ago";
import { IoAnalyticsOutline, IoShareOutline } from "react-icons/io5";
import {
  AiFillHeart,
  AiFillPushpin,
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineRetweet,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { useLoginModal, useReplyModal, useTweetId } from "../../lib/zustand";
import Avatar from "./Avatar";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { spawn } from "child_process";
import { v4 } from "uuid";
import MenuDropdown from "./MenuDropdown";
import useMediaQuery from "../../hooks/useMediaQuery";
import { BiDotsHorizontal } from "react-icons/bi";
import BottomMenuModal from "./BottomMenuModal";
import useLikeTweet from "../../hooks/useLikeTweet";
import useRetweet from "../../hooks/useRetweet";
import { FaRetweet } from "react-icons/fa";
import ShareDropdown from "./ShareDropdown";
import TweetContent from "./TweetContent";
import { motion } from "framer-motion";
import VoteComponentList from "./VoteComponentList";
import ProfileDropdown from "./ProfileDropdown";

interface IProps {
  tweet: TweetWithUser;
  isRetweet?: boolean;
  isYourRetweet?: boolean;
  retweetUsername?: string;
}

const TweetComponent = ({
  tweet,
  isRetweet,
  isYourRetweet,
  retweetUsername,
}: IProps) => {
  const now = new Date();
  const { data: session, status } = useSession();
  const msBetweenDates = tweet?.createdAt?.getTime() - now.getTime();
  const router = useRouter();
  const utils = trpc.useContext()
  const {
    // alreadyRetweeted,
    hasRetweeted,
    handleUndoRetweet,
    handleRetweet,
    isRetweeting,
    isUndoingRetweet,
  } = useRetweet(tweet.id);

  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
  const { data: alreadyRetweeted } = trpc.tweet.userAlreadyRetweet.useQuery({
    tweetId: tweet.id as string,
  },{
    refetchOnWindowFocus:false
  });
  const { modal, setModal } = useReplyModal();
  const { setModal: setLoginModal } = useLoginModal();
  const { data: alreadyLiked } = trpc.like.userLikeTweet.useQuery({
    tweetId: tweet.id as string,
  });
  const { setTweetId } = useTweetId();

  const {
    handleLike,
    handleUnlike,
    // alreadyLiked,
    setHasLiked,
    hasLiked,
    likeLoading,
    unlikeLoading,
  } = useLikeTweet(tweet);


  const _isYourRetweet = (tweet.userId as string) === session?.user?.id;
  const _retweetUsername = tweet.user.name;

  return (
    <>
      {tweet.retweet ? (
        <>
          <TweetComponent
            isRetweet={true}
            tweet={tweet.retweet as TweetWithUser}
            isYourRetweet={_isYourRetweet}
            retweetUsername={_retweetUsername as string}
          />
        </>
      ) : (
        <div
          onClick={() => {
            status === "authenticated"
              ? router.push(`/status/${tweet.id}`, undefined, {
                  shallow: true,
                })
              : setLoginModal(true);
          }}
          className="relative  cursor-pointer border-b border-gray-500 border-opacity-20  p-2 transition-all duration-100 ease-in-out hover:bg-base-200 md:gap-x-4 md:p-4"
        >
          {isRetweet ? (
            <p className="mb-2 flex items-center gap-x-2 font-semibold text-gray-400">
              <FaRetweet />
              {isYourRetweet ? "You retweeted" : `${retweetUsername} retweeted`}
            </p>
          ) : null}
          {router.pathname === "/[userId]/[username]" ? (
            <>
              {tweet.isPinned ? (
                <>
                  {!isRetweet ? (
                    <p className="mb-2 flex items-center gap-x-2 font-semibold text-gray-400">
                      <AiFillPushpin />
                      Tweet pinned
                    </p>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          <div className="flex items-start gap-x-2">
            <div className="dropdown dropdown-right dropdown-hover">
              <label tabIndex={5}>
                <Avatar image={tweet.user.image || ""} width={40} height={40} />
              </label>
              <ProfileDropdown userId={tweet.userId} tabIndex={5} />
            </div>

            <div className="flex flex-1  flex-col">
              <div className="flex items-center gap-x-2">
                <div onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/${tweet?.user.id}/${tweet?.user.name}`}
                    className="text-sm font-semibold hover:underline  xs:text-base md:text-lg"
                  >
                    {tweet?.user.name}
                  </Link>
                </div>

                <p className="text-xs text-gray-400 md:text-sm">
                  {hoursBetweenDates > 24 ? (
                    <span>{moment(tweet.createdAt as Date).format("ll")}</span>
                  ) : (
                    <ReactTimeAgo
                      date={tweet.createdAt as Date}
                      locale="en-US"
                    />
                  )}
                </p>
              </div>
              <TweetContent text={tweet?.text as string} />
              {tweet?.originalTweet ? (
                <p className="text-sm text-gray-500 md:text-base">
                  Replying to{" "}
                  <span className="text-primary">
                    {tweet.originalTweet.user.name}
                  </span>
                </p>
              ) : null}

              {tweet?.poll ? (
                <div className="flex flex-col gap-y-2">
                  <VoteComponentList
                    options={tweet.poll.options as OptionWithPayload[]}
                  />
                </div>
              ) : null}

              {tweet?.image ? (
                <div className="relative  h-96 w-full ">
                  {tweet?.image.includes("video") ? (
                    <video
                      controls
                      className="relative h-full w-full rounded-2xl"
                    >
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
              {/* {tweet.retweet ? (
            <TweetComponent tweet={tweet.retweet as TweetWithUser} />
          ) : null} */}
              <div className="flex  items-center justify-between">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    status === "authenticated"
                      ? setModal(true)
                      : setLoginModal(true);
                    setTweetId(tweet.id);
                  }}
                  className="md:text-basetext-xs group flex cursor-pointer items-center gap-x-2 rounded-full p-2 text-xs hover:bg-base-300 md:text-base"
                >
                  <AiOutlineComment className="group-hover:text-primary" />
                  <p className="group-hover:text-primary ">
                    {tweet?.replies?.length}
                  </p>
                </div>
                <div
                  className="group flex cursor-pointer items-center gap-x-2 rounded-full p-2 text-xs   hover:bg-base-300 md:text-base "
                  onClick={(e) => e.stopPropagation()}
                >
                  {(alreadyLiked !== null || hasLiked) &&
                  status === "authenticated" ? (
                    <button
                      onClick={handleUnlike}
                      disabled={likeLoading || unlikeLoading}
                    >
                      <AiFillHeart className="text-primary" />
                    </button>
                  ) : (
                    <button
                      onClick={handleLike}
                      disabled={unlikeLoading || likeLoading}
                    >
                      <AiOutlineHeart className="group-hover:text-primary" />
                    </button>
                  )}
                  <p
                    className={`${
                      (alreadyLiked !== null || hasLiked) &&
                      status === "authenticated"
                        ? "text-primary"
                        : null
                    } group-hover:text-primary`}
                  >
                    {tweet?.likes?.length}
                  </p>
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="group flex cursor-pointer items-center gap-x-2  rounded-full p-2 text-xs hover:bg-base-300 md:text-base"
                >
                  {(alreadyRetweeted !== null || hasRetweeted) &&
                  status === "authenticated" ? (
                    <button
                      onClick={handleUndoRetweet}
                      disabled={isUndoingRetweet || isRetweeting}
                    >
                      <AiOutlineRetweet className="text-primary group-hover:text-primary" />
                    </button>
                  ) : (
                    <button
                      onClick={handleRetweet}
                      disabled={isUndoingRetweet || isRetweeting}
                    >
                      <AiOutlineRetweet className="group-hover:text-primary" />
                    </button>
                  )}
                  <p
                    className={`${
                      (alreadyRetweeted || hasRetweeted) &&
                      status === "authenticated"
                        ? "text-primary"
                        : null
                    } group-hover:text-primary`}
                  >
                    {tweet?.retweets?.length}
                  </p>
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer   rounded-full px-4 py-2 transition-all duration-200 ease-in-out  hover:bg-base-300"
                >
                  <ShareDropdown tweetId={tweet.id as string} />
                </div>
                <div className="group cursor-pointer rounded-full  p-2 text-xs  hover:bg-base-300 md:text-base">
                  <IoAnalyticsOutline className="group-hover:text-primary" />
                </div>
              </div>
            </div>
            {status === "authenticated" ? (
              <div onClick={(e) => e.stopPropagation()}>
                <MenuDropdown tweet={tweet} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default TweetComponent;
