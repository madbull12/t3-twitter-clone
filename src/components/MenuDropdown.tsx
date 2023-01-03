import { useSession } from "next-auth/react";
import React from "react";
import { BiDotsHorizontal } from "react-icons/bi";
import { trpc } from "../utils/trpc";

const MenuDropdown = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: userTweets } = trpc.tweet.getUserTweets.useQuery({
    userId: session?.user?.id as string,
    link: "",
  });

  const isYourTweet = !!userTweets?.find((tweet) => tweet.id === tweetId);

  return (
    <div className="dropdown">
      <label tabIndex={0} className=" cursor-pointer ">
        <BiDotsHorizontal className="text-xl text-gray-400" />
      </label>
      {isYourTweet ? (
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <a className="text-red-500">Delete</a>
          </li>
          {/* <li>
       <a>Item 2</a>
     </li> */}
        </ul>
      ) : null}
    </div>
  );
};

export default MenuDropdown;
