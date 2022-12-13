import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const [term, setTerm] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    router.replace(
      {
        pathname: "/search",
        query: {
          ...router.query, // list all the queries here
          f: router.query.q ? router.query.f : "top",
          q: term,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center text-sm md:text-base gap-x-4 rounded-full bg-gray-100 md:px-4 px-2 py-1 md:py-2 text-gray-500"
    >
      <BiSearch />
      <input
        defaultValue={router.query.q}
        onChange={(e) => setTerm(e.target.value)}
        type="text"
        className="bg-transparent w-full outline-none"
        placeholder="Search Twitter"
      />
    </form>
  );
};

export default Search;
