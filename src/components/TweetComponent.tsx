import { Tweet, User } from "@prisma/client";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { ITweet, TweetWithUser } from "../../interface";
import moment from "moment";
import ReactTimeAgo from "react-time-ago";
import { IoAnalyticsOutline } from "react-icons/io5";
import {
  AiFillHeart,
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

interface IProps {
  tweet: TweetWithUser;
}

const TweetComponent = ({ tweet }: IProps) => {
  const now = new Date();
  const { data: session, status } = useSession();
  const msBetweenDates = tweet?.createdAt?.getTime() - now.getTime();
  const router = useRouter();
  const utils = trpc.useContext();
  const { mutate: likeTweet } = trpc.like.likeTweet.useMutation({
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
  console.log(tweet);
  const { mutate: unlikeTweet } = trpc.like.unlikeTweet.useMutation({
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
  const [hasLiked, setHasLiked] = useState(false);

  // 👇️ convert ms to hours                  min  sec   ms
  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

  // console.log(hoursBetweenDates);

  const { modal, setModal } = useReplyModal();
  const { setModal: setLoginModal } = useLoginModal();

  const { setTweetId } = useTweetId();

  const { data: alreadyLiked } = trpc.like.userLikeTweet.useQuery({
    tweetId: tweet.id,
  });

  const handleLike = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    if (status === "authenticated") {
      toast.success(alreadyLiked !== null ? "Tweet unliked" : "Tweet liked");
      alreadyLiked !== null
        ? unlikeTweet({ tweetId: tweet.id })
        : likeTweet({ tweetId: tweet.id });
    } else {
      setLoginModal(true);
    }
  };

  const tablet = useMediaQuery("(min-width:768px)");

  return (
    <div
      onClick={() => {
        status === "authenticated"
          ? router.push(`/status/${tweet.id}`, undefined, {
              shallow: true,
            })
          : setLoginModal(true);
      }}
      className="relative flex cursor-pointer items-start gap-x-2 p-2 transition-all duration-100 ease-in-out hover:bg-base-200 md:gap-x-4 md:p-4"
    >
      <div >
        <Avatar image={tweet.user.image || ""} width={40} height={40} />
      </div>

      <div className="flex flex-1  flex-col">
        <div className="flex items-center gap-x-2">
          <Link
            href={`/${tweet?.user.id}/${tweet?.user.name}`}
            className="text-sm font-semibold hover:underline  xs:text-base md:text-lg"
          >
            {tweet?.user.name}
          </Link>
          <p className="text-xs text-gray-400 md:text-sm">
            {hoursBetweenDates > 24 ? (
              <span>{moment(tweet.createdAt as Date).format("ll")}</span>
            ) : (
              <ReactTimeAgo date={tweet.createdAt as Date} locale="en-US" />
            )}
          </p>
        </div>
        <p className="text-xs xs:text-sm md:text-base">
          {tweet.text?.split(" ").map((word: string) =>
            word.startsWith("#") ? (
              <span
                key={v4()}
                onClick={(e) => {
                  e.stopPropagation();
                  router.replace(
                    {
                      pathname: "/search",
                      query: {
                        ...router.query, // list all the queries here
                        f: router.query.q ? router.query.f : "top",
                        q: word,
                      },
                    },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
                className="text-primary hover:underline"
              >
                {word + " "}
              </span>
            ) : (
              <span>{word + " "}</span>
            )
          )}
        </p>
        {tweet?.originalTweet ? (
          <p className="text-sm text-gray-500 md:text-base">
            Replying to{" "}
            <span className="text-primary">
              {tweet.originalTweet.user.name}
            </span>
          </p>
        ) : null}

        {tweet?.image ? (
          <div className="relative  h-96 w-full md:w-3/4">
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
              e.stopPropagation();
              status === "authenticated" ? setModal(true) : setLoginModal(true);
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
            onClick={handleLike}
          >
            {(alreadyLiked !== null || hasLiked) &&
            status === "authenticated" ? (
              <AiFillHeart
                onClick={() => setHasLiked(false)}
                className="text-primary"
              />
            ) : (
              <AiOutlineHeart
                onClick={() => setHasLiked(true)}
                className="group-hover:text-primary"
              />
            )}
            <p
              className={`${
                (alreadyLiked !== null || hasLiked) &&
                status === "authenticated"
                  ? "text-primary"
                  : null
              } group-hover:text-primary`}
            >
              {tweet.likes.length}
            </p>
          </div>
          <div className="group cursor-pointer rounded-full p-2 text-xs   hover:bg-base-300 md:text-base">
            <AiOutlineRetweet className="group-hover:text-primary" />
          </div>
          <div className="group cursor-pointer rounded-full p-2 text-xs   hover:bg-base-300 md:text-base">
            <AiOutlineShareAlt className="group-hover:text-primary" />
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
  );
};

export default TweetComponent;
