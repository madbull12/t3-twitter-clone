import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import NavFeed from "./NavFeed";

const FollowersFollowingNav = () => {
    const { data: session } = useSession();
    const router = useRouter();
  return (
    <>
      <NavFeed title={router.query.username as string}>
        <ul className="flex w-full items-center justify-between">
          {/* <li onClick={()=>router.push(`/${router.query.userId}/${router.query.username}/followers`)} className={` flex-1 cursor-pointer p-4 text-center font-semibold text-gray-500 transition-all duration-150 ease-linear   hover:bg-base-300`}>
            Followers you know
          </li> */}
          <li onClick={()=>router.push(`/${router.query.userId}/${router.query.username}/followers`)} className={`${router.pathname.includes("followers") ? "border-b-4 border-primary" : null} flex-1 cursor-pointer p-4 text-center   font-semibold text-gray-500 transition-all duration-150 ease-linear hover:bg-base-300`}>
            Followers
          </li>
          <li onClick={()=>router.push(`/${router.query.userId}/${router.query.username}/following`)} className={`${router.pathname.includes("following") ? "border-b-4 border-primary" : null} flex-1 cursor-pointer p-4 text-center font-semibold   text-gray-500 transition-all duration-150 ease-linear hover:bg-base-300`}>
            Following
          </li>
        </ul>
      </NavFeed>
    </>
  );
};

export default FollowersFollowingNav;
