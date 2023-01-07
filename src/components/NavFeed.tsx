import { Tweet } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import useMediaQuery from "../../hooks/useMediaQuery";
import Avatar from "./Avatar";

const NavFeed = ({ title, tweets }: { title: string; tweets?: number }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const phone = useMediaQuery("(min-width:768px)");
  return (
    <nav className="sticky top-0 z-50  flex w-full items-center gap-x-4 bg-base-100/30 p-2  backdrop-blur-lg  md:gap-x-4">
      {!phone ? (
        <>
          {router.pathname === "/" ? (
            <Avatar
              image={session?.user?.image as string}
              width={30}
              height={30}
            />
          ) : null}
        </>
      ) : null}

      {router.pathname !== "/" ? (
        <BsArrowLeft
          className="cursor-pointer text-xl"
          onClick={() => router.back()}
        />
      ) : null}

      <div className="flex flex-col  items-start">
        <h1 className=" text-xl font-semibold">{title}</h1>
        {tweets ? (
          <p className="text-xs text-gray-500 sm:text-sm">{tweets} tweets</p>
        ) : null}
      </div>
    </nav>
  );
};

export default NavFeed;
