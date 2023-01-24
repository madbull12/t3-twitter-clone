import React, { useState } from "react";
import { v4 } from "uuid";
import { trpc } from "../utils/trpc";
import Loader from "./Loader";
import TweetComponent from "../components/TweetComponent";
import { Tweet } from "@prisma/client";
import { TweetWithUser } from "../../interface";
import { useRouter } from "next/router";

const TweetList = ({ tweets }: { tweets: Tweet[] }) => {
  const [itemCount, setItemCount] = useState(5);
  const router = useRouter();
  return (
    <div className="w-full">
      <>
        {router.pathname === "/" ? (
          <>
            {tweets?.map((tweet) => (
              <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
            ))}
          </>
        ) : (
          <>
            {router.pathname === "/[userId]/[username]" ? (
              <>
                {tweets
                  ?.slice(0, itemCount)
                  .filter((tweet) => tweet.isPinned === true)
                  .map((tweet) => (
                    <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
                  ))}
                {tweets
                  ?.slice(0, itemCount)
                  .filter((tweet) => tweet.isPinned === false)
                  .map((tweet) => (
                    <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
                  ))}
              </>
            ) : (
              <>
                {tweets?.slice(0, itemCount).map((tweet) => (
                  <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
                ))}
              </>
            )}
          </>
        )}
      </>
      {router.pathname !== "/" ? (
        <>
          {tweets?.length > 5 ? (
            <div className="grid place-items-center">
              <button
                className="my-4  justify-center  rounded-lg bg-base-200 px-4 py-2 font-bold text-primary shadow-md "
                onClick={() => {
                  itemCount >= tweets?.length
                    ? setItemCount((prev) => prev - 5)
                    : setItemCount((prev) => prev + 5);
                }}
              >
                {itemCount >= tweets?.length ? "Show less" : "Show more"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default TweetList;
