import { Prisma } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { v4 } from "uuid";
import Avatar from "../../components/Avatar";
import Body from "../../components/Body";
import Loader from "../../components/Loader";
import ReplyForm from "../../components/ReplyForm";
import TweetComponent from "../../components/TweetComponent";
import { trpc } from "../../utils/trpc";





const StatusPage = () => {
  const router: any = useRouter();
  const { statusId } = router.query;

  const { data: tweetDetails, isLoading } = trpc?.tweet.getSingleTweet.useQuery(
    {
      tweetId: statusId,
    }
  );

  const { data:replies } = trpc?.tweet.getTweetReplies.useQuery({
    tweetId:statusId
  })

  return (
    <Body>
      <div className="sticky top-0  z-50 flex items-center gap-x-8 bg-white/30 p-4 backdrop-blur-lg">
        <BsArrowLeft
          className="cursor-pointer text-xl"
          onClick={() => router.back()}
        />
        <h1 className="px-4 text-xl font-semibold">Tweet</h1>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-x-4">
            <Avatar image={tweetDetails?.user.image as string} />
            <p className="font-semibold">{tweetDetails?.user.name}</p>
          </div>
          <p className="text-2xl">{tweetDetails?.text}</p>
          {tweetDetails?.image ? (
            <div className="relative  h-96 w-3/4">
              {tweetDetails?.image.includes("video") ? (
                <video controls className="relative h-full w-full rounded-2xl">
                  <source src={tweetDetails?.image} type="video/mp4"></source>
                </video>
              ) : (
                <Image
                  objectFit="cover"
                  alt={tweetDetails?.text ?? ""}
                  src={tweetDetails?.image}
                  className="rounded-2xl"
                  layout="fill"
                />
              )}
            </div>
          ) : null}
          <div className="flex items-center gap-x-2 ">
            <p className=" text-gray-500">
              {moment(tweetDetails?.createdAt).format("LT")}
            </p>
            <p className=" text-gray-500">
              {moment(tweetDetails?.createdAt).format("ll")}
            </p>
          </div>
          <div></div>
          <ReplyForm tweetId={tweetDetails?.id || ""} />
          <div>
            {replies?.map((reply)=>(
              <TweetComponent tweet={reply} key={v4()}/>
            ))}
          </div>
        </div>
      )}
    </Body>
  );
};

export default StatusPage;
