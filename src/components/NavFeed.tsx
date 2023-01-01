import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";

const NavFeed = ({ title, tweets }: { title: string; tweets?: number }) => {
  const router = useRouter();
  return (
    <nav className="sticky top-0 p-2  w-full z-50 flex items-center gap-x-4 bg-white/30  backdrop-blur-lg  md:gap-x-4">
      <BsArrowLeft
        className="cursor-pointer text-xl"
        onClick={() => router.back()}
      />
      <div className="flex flex-col  items-start">
        <h1 className=" text-xl font-semibold">{title}</h1>
        {tweets ? <p className="text-gray-500 text-xs sm:text-sm">{tweets} tweets</p> : null}
        
      </div>
    </nav>
  );
};

export default NavFeed;
