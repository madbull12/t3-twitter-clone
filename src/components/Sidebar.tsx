import Link from "next/link";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { AiFillHome, AiFillBell } from "react-icons/ai";
import { RiHashtag } from "react-icons/ri";
import { v4 } from "uuid";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Profile from "./Profile";
const links = [
  {
    name: "Home",
    icon: <AiFillHome />,
  },
  {
    name: "Explore",
    icon: <RiHashtag />,
  },
  {
    name: "Notifications",
    icon: <AiFillBell />,
  },
];
const Sidebar = () => {
  const { status } = useSession();
  return (
    <div className="fixed space-y-4 left-0 top-0 min-h-screen w-80  py-3 pl-16 pr-8">
      <div className="mb-2 grid h-12 w-12 cursor-pointer place-items-center  rounded-full transition-all duration-200 ease-in-out  hover:bg-blue-100">
        <BsTwitter className="text-3xl text-primary" />
      </div>
      <ul>
        {links.map((link) => (
          <li
            key={v4()}
            className="rounded-full px-4 py-2  transition-all  duration-200 ease-in-out  hover:bg-gray-100"
          >
            <Link href="/">
              <span className="flex items-center gap-x-4 text-2xl">
                {link.icon}
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Button text="Tweet" />
      {status === "authenticated" ? (
        <button
          onClick={() => signOut()}
          className="px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black "
        >
          <BsTwitter className="text-primary" />
          <span>Sign out</span>
        </button>
      ) : (
        <button
          onClick={() => signIn("twitter")}
          className="px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black "
        >
          <BsTwitter className="text-primary" />
          <span>Sign in</span>
        </button>
      )}
      {status === "authenticated" ? <Profile /> : null}
    </div>
  );
};

export default Sidebar;
