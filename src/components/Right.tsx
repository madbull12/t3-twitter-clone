import { useRouter } from "next/router";
import React from "react";
import Search from "./Search";

const Right = () => {
  const router = useRouter();
  const pathnames = ["/search", "/explore"];

  return (
    <div className="absolute z-[888] pl-[11%] bg-base-100 pr-4 right-0 top-0 min-h-[120vh] w-72 py-3  xl:w-80 ">
      {pathnames.includes(router.pathname) ? null : <Search />}
    </div>
  );
};

export default Right;
