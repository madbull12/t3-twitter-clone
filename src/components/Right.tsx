import { useRouter } from "next/router";
import React from "react";
import Search from "./Search";

const Right = () => {
  const router = useRouter();
  const pathnames = ["/search","/explore"]

  return (
    <div className="absolute right-0 top-0  min-h-screen xl:w-96 w-72  py-3 px-8 ">
      {pathnames.includes(router.pathname) ? null : <Search />}
    </div>
  );
};

export default Right;
