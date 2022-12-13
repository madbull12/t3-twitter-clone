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
      <button
        className="px-4 py-2 font-bold text-blue-400 shadow-md justify-center mt-4 rounded-lg "
        onClick={() => {
            itemCount >= tweets.length ?  setItemCount((prev) => prev - 5) : setItemCount((prev)=>prev+5)
        }
           
        }
      >
        {itemCount >= tweets.length ? "Show less":"Show more"}
      </button>
    </div>
  );
};

export default TweetList;
