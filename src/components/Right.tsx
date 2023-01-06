import { useRouter } from "next/router";
import React from "react";
import Search from "./Search";

const Right = () => {
  const router = useRouter();
  const pathnames = ["/search", "/explore"];

  return (
    <div className="absolute pl-[9%] pr-8 right-0 top-0 min-h-screen w-72 py-3  xl:w-80 ">
      {pathnames.includes(router.pathname) ? null : <Search />}
    </div>
  );
};

export default Right;
