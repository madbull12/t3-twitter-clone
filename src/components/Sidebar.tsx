import Link from "next/link";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { AiFillHome, AiFillBell } from "react-icons/ai";
import { RiHashtag } from "react-icons/ri";
import { v4 } from "uuid";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Profile from "./Profile";
import useMediaQuery from "../../hooks/useMediaQuery";
import { IoMdAddCircle, IoMdLogIn, IoMdLogOut } from "react-icons/io";
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
  const matches = useMediaQuery("(min-width: 1024px)");
  return (
    <div className="fixed left-0 top-0 flex min-h-screen w-20 flex-col items-center space-y-4 border border-gray-100  lg:w-80 lg:items-start  lg:py-3 lg:pl-16 lg:pr-8">
      <div className="mb-2 grid h-12 w-12 cursor-pointer place-items-center  rounded-full transition-all duration-200 ease-in-out  hover:bg-blue-100">
        <BsTwitter className="text-3xl text-primary" />
      </div>
      <ul className="flex flex-col items-center space-y-2 px-4 lg:items-start">
        {links.map((link) => (
          <li
            key={v4()}
            className="rounded-full  transition-all  duration-200 ease-in-out  hover:bg-gray-100"
          >
            <Link href="/">
              <span className="flex items-center gap-x-4 text-2xl">
                {link.icon}
                <span className="hidden lg:block ">{link.name}</span>
              </span>
            </Link>
          </li>
        ))}

        {!matches ? <IoMdAddCircle className="text-6xl text-primary" /> : null}
      </ul>
      {matches ? <Button text="Tweet" /> : null}

      {status === "authenticated" ? (
        <button
          onClick={() => signOut()}
          className={`${
            matches
              ? "px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black"
              : null
          }`}
        >
          {matches ? (
            <>
              <BsTwitter className="text-primary " />
              <span className="">Sign out</span>
            </>
          ) : (
            <IoMdLogOut className="text-4xl" />
          )}
        </button>
      ) : (
        <button
          onClick={() => signIn("twitter")}
          className="px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black "
        >
          {matches ? (
            <>
              <BsTwitter className="text-primary " />
              <span className="">Sign in</span>
            </>
          ) : (
            <IoMdLogIn className="text-4xl" />
          )}
        </button>
      )}
      {status === "authenticated" ? <Profile /> : null}
    </div>
  );
};

export default Sidebar;
