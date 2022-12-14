import React, { useState } from "react";
import { v4 } from "uuid";
import { trpc } from "../utils/trpc";
import Loader from "./Loader";
import TweetComponent from "../components/TweetComponent";
import { Tweet } from "@prisma/client";

const TweetList = ({ tweets }: { tweets: Tweet[] }) => {
  const [itemCount, setItemCount] = useState(5);
  return (
    <div>
      <>
        {tweets?.slice(0, itemCount).map((tweet) => (
          <TweetComponent tweet={tweet} key={v4()} />
        ))}
      </>
      {tweets?.length > 5 ? (
        <button
          className="mt-4 justify-center rounded-lg px-4 py-2 font-bold text-blue-400 shadow-md "
          onClick={() => {
            itemCount >= tweets?.length
              ? setItemCount((prev) => prev - 5)
              : setItemCount((prev) => prev + 5);
          }}
        >
          {itemCount >= tweets?.length ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
};

export default TweetList;
