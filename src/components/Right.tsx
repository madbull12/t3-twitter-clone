import { useRouter } from "next/router";
import React from "react";
import Search from "./Search";

const Right = () => {
  const router = useRouter();

  return (
    <div className="absolute right-0 top-0  min-h-screen xl:w-96 w-72  py-3 px-8 ">
      {router.pathname === "/search" ? null : <Search />}
    </div>
  );
};

export default Right;
