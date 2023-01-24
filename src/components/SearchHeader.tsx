import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { v4 } from "uuid";
import Search from "./Search";

const links = ["top", "latest", "people", "photos", "videos"];

const SearchHeader = () => {
  const router = useRouter();
  return (
    <div className="sticky backdrop-blur-xl bg-base-100/30 top-0 z-50 border-b border-base-300  ">
      <div className="flex items-center gap-x-2 justify-between p-2">
        <BsArrowLeft
          className="cursor-pointer text-lg md:text-xl"
          onClick={() => router.back()}
        />
        <div className="flex-[.75]">
          <Search placeholder="Search Twitter" />
        </div>
      </div>
      <ul className=" flex items-center justify-between flex-wrap">
        {links.map((link: string) => (
          <li
            key={v4()}
            onClick={() =>
              router.replace(
                {
                  query: {
                    ...router.query, // list all the queries here
                    f: link,
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              )
            }
            className={`${
              router.query.f === link ? "border-b-4    border-primary" : null
            } cursor-pointer px-2 py-1 md:px-6 md:py-2 font-semibold capitalize text-gray-500 text-sm md:text-base hover:bg-base-300`}
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHeader;
