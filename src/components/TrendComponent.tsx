import { Hashtag, Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";

type HashtagWithTweet = Prisma.HashtagGetPayload<{
  include: {
    tweets: true;
  };
}>;
const TrendComponent = ({ hashtag }: { hashtag: HashtagWithTweet }) => {
  return (
    <Link href={`/search?q=${hashtag.name}&f=top`}>
      <div className="cursor-pointer space-y-1 p-2 hover:bg-base-200">
        <p className="text-xs text-gray-500 md:text-base">Trending</p>
        <p className="text-lg font-semibold">#{hashtag.name}</p>
        <p className="text-sm text-gray-500 md:text-base">
          {hashtag.tweets.length} Tweets
        </p>
      </div>
    </Link>
  );
};

export default TrendComponent;
