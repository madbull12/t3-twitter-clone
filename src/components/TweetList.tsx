import React, { useState } from "react";
import { v4 } from "uuid";
import { trpc } from "../utils/trpc";
import Loader from "./Loader";
import TweetComponent from "../components/TweetComponent";
import { Tweet } from "@prisma/client";
import { TweetWithUser } from "../../interface";
import { useRouter } from "next/router";
import { useMediaQuery } from "usehooks-ts";

const TweetList = ({ tweets }: { tweets: TweetWithUser[] }) => {
  const router = useRouter();
  const phone = useMediaQuery("(min-width:768px)");


  return (
    <div
      className={`w-full ${
        router.pathname !== "/" ? (phone ? null : "pb-16") : null
      } `}
    >
          {router.pathname === "/[userId]/[username]" ? (
            <>
              {tweets
                // ?.slice(0, itemCount)
                .filter((tweet) => tweet.isPinned === true)
                .map((tweet) => (
                  <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
                ))}
              {tweets
                .filter((tweet) => tweet.isPinned === false)
                .map((tweet) => (
                  <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
                ))}
            </>
          ) : (
            <>
              {tweets?.map((tweet) => (
                <TweetComponent tweet={tweet as TweetWithUser} key={v4()} />
              ))}
            </>
          )}
      {/* {(!exceptionLinks.includes(router.pathname))? (
        <>
          {tweets?.length > 5 ? (
            <div className="grid place-items-center">
              <button
                className={`my-8  justify-center  rounded-lg bg-base-200 px-4 py-2 ${phone ? "" : "text-sm"} font-bold text-primary shadow-md `}
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
      ) : null} */}
    </div>
  );
};

export default TweetList;
