import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { BiBookmark, BiUser } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useOnClickOutside } from "usehooks-ts";
import { v4 } from "uuid";
import { useMobileDrawer } from "../../lib/zustand";
import Avatar from "./Avatar";
import Backdrop from "./Backdrop";
import MoreDropdownSidebar from "./MoreDropdownSidebar";

const MobileDrawer = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const { setDrawer, drawer } = useMobileDrawer();
  useOnClickOutside(drawerRef, () => {
    setDrawer(false);
  });

  const { data: session } = useSession();
  const links = [
    {
      name: "Profile",
      link: `/${session?.user?.id}/${session?.user?.name}`,
      hidden: true,
      icon: <BiUser />,
    },
    {
      name: "Bookmarks",
      link: `/bookmarks`,
      hidden: true,
      icon: <BiBookmark />,
    },
  ];
  return (
    <Backdrop>
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 space-y-4 p-4 transition-transform duration-150 ease-in-out ${
          drawer ? "translate-x-0" : "-translate-x-full"
        } bottom-0 z-[999999] min-h-screen min-w-[75vw] bg-base-100`}
      >
        {/* Drawer content goes here */}
        <header className="flex items-center justify-between">
          <p className="font-semibold">Account info</p>
          <IoMdClose
            className="cursor-pointer"
            onClick={() => setDrawer(false)}
          />
        </header>
        <div className="">
          <Avatar
            image={session?.user?.image as string}
            width={30}
            height={30}
          />
          <p className="font-semibold">{session?.user?.name}</p>
          <p className="text-gray-400">User Id: {session?.user?.id}</p>
        </div>
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={v4()}
              className="rounded-full px-4 py-2 font-semibold transition-all duration-300 ease-in-out  hover:bg-base-300"
            >
              <Link href={link?.link}>
                <div className="flex items-center gap-x-4 text-sm xs:text-xl md:text-2xl">
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </div>
              </Link>
            </li>
          ))}
          <li
            key={v4()}
            className="rounded-full font-semibold transition-all duration-300 ease-in-out  hover:bg-base-300"
          >
              <MoreDropdownSidebar mobile={true} />
          </li>
        </ul>
        <button
          onClick={() => signOut()}
          className={`${
       
               "px-y mt-4 flex w-full items-center justify-center gap-x-2  rounded-full border border-primary py-2 font-semibold  "
             
          }`}
        >
         
            <>
              <BsTwitter className="text-primary " />
              <span className="">Sign out</span>
            </>
      
        </button>
      </div>
    </Backdrop>
  );
};

export default MobileDrawer;
