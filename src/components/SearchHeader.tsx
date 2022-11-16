import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import Search from "./Search";

const links = ["top", "latest", "people", "photos", "videos"];

const SearchHeader = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between">
        <BsArrowLeft
          className="cursor-pointer text-xl"
          onClick={() => router.back()}
        />
        <div className="flex-[0.5]">
          <Search />
        </div>
      </div>
      <ul className="mt-4 flex items-center justify-between">
        {links.map((link: string) => (
          <li
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
            className={`${router.query.f === link ? "border-b-4    border-primary":null} px-6 py-4 hover:bg-gray-100 cursor-pointer font-semibold capitalize text-gray-500`}
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHeader;
