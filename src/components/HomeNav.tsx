import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import NavFeed from "./NavFeed";

const HomeNav = () => {
  const { status } = useSession();
  const router = useRouter();

  return (
    <NavFeed title="Home">
      {status === "authenticated" ? (
        <ul className="flex w-full items-center justify-between">
          {/* <li onClick={()=>router.push(`/${router.query.userId}/${router.query.username}/followers`)} className={` flex-1 cursor-pointer p-4 text-center font-semibold text-gray-500 transition-all duration-150 ease-linear   hover:bg-base-300`}>
                Followers you know
              </li> */}
          <li
            onClick={() => router.push("/")}
            className={`${
              router.pathname === "/" ? "border-b-4 border-primary" : null
            } flex-1 cursor-pointer p-4 text-center   font-semibold text-gray-500 transition-all duration-150 ease-linear hover:bg-base-300`}
          >
            For you
          </li>
          <li
            onClick={() => router.push("/following")}
            className={`${
              router.pathname === "/following"
                ? "border-b-4 border-primary"
                : null
            } flex-1 cursor-pointer p-4 text-center font-semibold   text-gray-500 transition-all duration-150 ease-linear hover:bg-base-300`}
          >
            Following
          </li>
        </ul>
      ) : null}
    </NavFeed>
  );
};

export default HomeNav;
