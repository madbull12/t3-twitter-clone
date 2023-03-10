import Link from "next/link";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import {
  AiFillHome,
  AiFillBell,
  AiOutlineHome,
  AiOutlineBell,
  AiFillMail,
  AiOutlineMail,
} from "react-icons/ai";
import {
  RiFileListFill,
  RiFileListLine,
  RiHashtag,
  RiUserFill,
  RiUserLine,
} from "react-icons/ri";
import { v4 } from "uuid";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Profile from "./Profile";
import useMediaQuery from "../../hooks/useMediaQuery";
import { IoMdAddCircle, IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { useCreateModal } from "../../lib/zustand";
import { BiSearch } from "react-icons/bi";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import MoreDropdownSidebar from "./MoreDropdownSidebar";
import { useRouter } from "next/router";
import { FaHashtag, FaSearch } from "react-icons/fa";

const Sidebar = () => {
  const { status, data: session } = useSession();
  const matches = useMediaQuery("(min-width: 1280px)");
  const isNotTablet = useMediaQuery("(min-width:1024px)");
  const router = useRouter();
  const links = [
    {
      name: "Home",
      link: "/",
      hidden: false,
      active: router.pathname === "/" || router.pathname === "/following",
      icon: router.pathname === "/" || router.pathname === "/following" ? <AiFillHome /> : <AiOutlineHome />,
    },
    {
      name: "Explore",
      link: "/explore",
      active: router.pathname === "/explore",
      hidden: false,
      icon: isNotTablet ? (
        router.pathname === "/explore" ? (
          <FaHashtag />
        ) : (
          <RiHashtag />
        )
      ) : router.pathname === "/explore" ? (
        <FaSearch />
      ) : (
        <BiSearch />
      ),
    },
    {
      name: "Notifications",
      link: "/notifications",
      hidden: true,
      active: router.pathname === "/notifications",
      icon:
        router.pathname === "/notifications" ? (
          <AiFillBell />
        ) : (
          <AiOutlineBell />
        ),
    },
    {
      name:"Messages",
      link:"/messages",
      hidden: true,
      active: router.pathname === "/messages",
      icon:
      router.asPath ===
      `/messages` ? (
        <AiFillMail/>
      ) : (
        <AiOutlineMail  />
      ),
    },
    {
      name: "Profile",
      link: `/${session?.user?.id}/${session?.user?.name?.replace(/\s/g, "")}`,
      hidden: true,
      active:
        router.asPath ===
        `/${session?.user?.id}/${session?.user?.name?.replace(/\s/g, "")}`,
      icon:
        router.asPath ===
        `/${session?.user?.id}/${session?.user?.name?.replace(/\s/g, "")}` ? (
          <RiUserFill />
        ) : (
          <RiUserLine />
        ),
    },
    {
      name: "Bookmarks",
      link: `/bookmarks`,
      hidden: true,
      active: router.pathname === "/bookmarks",
      icon:
        router.pathname === "/bookmarks" ? (
          <IoBookmark />
        ) : (
          <IoBookmarkOutline />
        ),
    },
    {
      name: "Lists",
      link: `/list/${session?.user?.id}`,
      active: router.asPath === `/list/${session?.user?.id}`,
      hidden: true,
      icon:
        router.asPath === `/list/${session?.user?.id}` ? (
          <RiFileListFill />
        ) : (
          <RiFileListLine />
        ),
    },
  ];

  const { setModal } = useCreateModal();
  return (
    <div className="fixed top-0 z-[9999] flex  min-h-[200vh] w-14 flex-col items-center space-y-4  xs:w-20  xl:w-80 xl:items-start  xl:py-3 xl:pl-8 xl:pr-8">
      <div className=" grid h-12 w-12 cursor-pointer place-items-center  rounded-full transition-all duration-200 ease-in-out  hover:bg-base-300">
        <Link href="/">
          <BsTwitter className="text-xl text-primary md:text-2xl lg:text-3xl" />
        </Link>
      </div>
      <ul className="flex flex-col  items-center   px-4 xl:items-start">
        {links.map((link) => (
          <>
            {link.hidden ? (
              <>
                {status === "authenticated" ? (
                  <li
                    key={v4()}
                    className="rounded-full px-4 py-2  transition-all duration-300 ease-in-out  hover:bg-base-300"
                  >
                    <Link href={link?.link}>
                      <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
                        <span>{link.icon}</span>
                        <span
                          className={`hidden xl:block ${
                            link.active ? "font-bold" : null
                          }`}
                        >
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ) : null}
              </>
            ) : (
              <li
                key={v4()}
                className="rounded-full px-4 py-2 transition-all duration-200 ease-in-out  hover:bg-base-300"
              >
                <Link href={link?.link}>
                  <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
                    <span>{link.icon}</span>
                    <span
                      className={`hidden xl:block ${
                        link.active ? "font-bold" : null
                      }`}
                    >
                      {link.name}
                    </span>
                  </div>
                </Link>
              </li>
            )}
          </>
        ))}
        {status === "authenticated" ? <MoreDropdownSidebar /> : null}

        {!matches ? (
          <>
            {status === "authenticated" ? (
              <IoMdAddCircle
                onClick={() => setModal(true)}
                className="cursor-pointer text-4xl text-primary xs:text-6xl"
              />
            ) : null}
          </>
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
              ? "px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  "
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
          onClick={() => router.push("/auth/signin")}
          className={`${
            matches
              ? "px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  "
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
