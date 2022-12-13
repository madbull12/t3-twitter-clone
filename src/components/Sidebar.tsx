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
import { useCreateModal } from "../../lib/zustand";
import { BiSearch } from "react-icons/bi";

const Sidebar = () => {
  const { status } = useSession();
  const matches = useMediaQuery("(min-width: 1280px)");
  const isNotTablet = useMediaQuery("(min-width:1024px)");
  const links = [
    {
      name: "Home",
      link:"/",
      icon: <AiFillHome />,
    },
    {
      name: "Explore",
      link:"/explore",
      icon: isNotTablet ? <RiHashtag /> : <BiSearch />,
    },
    {
      name: "Notifications",
      link:"/",

      icon: <AiFillBell />,
    },
  ];
  const { setModal } = useCreateModal();
  return (
    <div className="fixed left-0 top-0 flex min-h-screen w-14 flex-col items-center space-y-4 border border-gray-100 xs:w-20  xl:w-80 xl:items-start  xl:py-3 xl:pl-16 xl:pr-8">
      <div className="mb-2 grid h-12 w-12 cursor-pointer place-items-center  rounded-full transition-all duration-200 ease-in-out  hover:bg-blue-100">
        <Link href="/">
          <BsTwitter className="text-xl md:text-2xl lg:text-3xl text-primary" />
        </Link>
      </div>
      <ul className="flex flex-col items-center space-y-2 px-4 xl:items-start">
        {links.map((link) => (
          <li
            key={v4()}
            className="rounded-full  px-4  py-2 transition-all duration-200 ease-in-out  hover:bg-gray-100"
          >
            <Link href={link?.link}>
              <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
                <span>{link.icon}</span>
                <span className="hidden xl:block ">{link.name}</span>
              </div>
            </Link>
          </li>
        ))}

        {!matches ? (
          <IoMdAddCircle
            onClick={() => setModal(true)}
            className="cursor-pointer text-4xl text-primary xs:text-6xl"
          />
        ) : null}
      </ul>
      {status === "authenticated" ? (
        <>
          {matches ? (
            <Button text="Tweet" handleClick={() => setModal(true)} />
          ) : null}
        </>
      ) : null}

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
            <IoMdLogOut className="text-2xl xs:text-4xl" />
          )}
        </button>
      ) : (
        <button
          onClick={() => signIn("twitter")}
          className={`${
            matches
              ? "px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  text-black"
              : null
          }`}
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
