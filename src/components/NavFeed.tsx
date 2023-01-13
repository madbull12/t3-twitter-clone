import { Tweet } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import useMediaQuery from "../../hooks/useMediaQuery";
import Avatar from "./Avatar";
import { useState } from "react";
import MobileDrawerToggle from "./MobileDrawerToggle";

const NavFeed = ({
  title,
  tweets,
  children,
}: {
  title: string;
  tweets?: number;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const phone = useMediaQuery("(min-width:768px)");
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <nav className="sticky top-0 z-50  w-full  bg-base-100/30 p-3  backdrop-blur-lg  md:gap-x-4">
      <div className="flex items-center gap-x-8">
        {!phone ? (
          <>
            {router.pathname === "/" ? (
              <>{status === "authenticated" ? <MobileDrawerToggle /> : null}</>
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
      </div>

      {children}
    </nav>
  );
};

export default NavFeed;
