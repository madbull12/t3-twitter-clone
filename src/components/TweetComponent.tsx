import { Tweet, User } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { ITweet } from "../../interface";
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

type TweetWithUser = Prisma.TweetGetPayload<{
  include: {
    user: true;

    originalTweet: {
      include: {
        user: true;
      };
    };
    likes: true;
  };
}>;

interface IProps {
  tweet: TweetWithUser | any;
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
  console.log(tweet)
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

  return (
    <div
      onClick={() => {
        status === "authenticated"
          ? router.push(`/status/${tweet.id}`, undefined, {
              shallow: true,
            })
          : setLoginModal(true);
      }}
      className="flex cursor-pointer items-start gap-x-4 p-4 transition-all duration-100 ease-in-out hover:bg-gray-100"
    >
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
        <p>
          {tweet.text?.split(" ").map((word: string) =>
            word.startsWith("#") ? (
              <span
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
          <p className="text-gray-500">
            Replying to{" "}
            <span className="text-primary">
              {tweet.originalTweet.user.name}
            </span>
          </p>
        ) : null}

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
              e.stopPropagation();
              status === "authenticated" ? setModal(true) : setLoginModal(true);
              setTweetId(tweet.id);
            }}
            className="group cursor-pointer rounded-full flex gap-x-2 items-center p-2 hover:bg-blue-50"
          >
            <AiOutlineComment className="group-hover:text-primary" />
            <p className="group-hover:text-primary">{tweet?.replies?.length}</p>
          </div>
          <div
            className="group flex cursor-pointer items-center gap-x-2 rounded-full  p-2 "
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
