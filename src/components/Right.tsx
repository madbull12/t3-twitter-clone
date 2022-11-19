import { useRouter } from "next/router";
import React from "react";
import Search from "./Search";

const Right = () => {
  const router = useRouter();

  return (
    <div className="absolute right-0 top-0 hidden min-h-screen w-96  py-3 px-8 lg:block">
      {router.pathname === "/search" ? null : <Search />}
    </div>
  );
};

export default Right;
