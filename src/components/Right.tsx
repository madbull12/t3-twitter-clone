import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import FollowRecommendations from "./FollowRecommendations";
import Search from "./Search";
import TrendList from "./TrendList";

const Right = () => {
  const router = useRouter();
  const pathnames = ["/search", "/explore"];
  const { status } = useSession();

  return (
    <div className="absolute right-0 top-0 z-[888] min-h-[120vh] w-72 space-y-4 bg-base-100 py-3 pl-[3%] pr-4  xl:w-80 ">
      {pathnames.includes(router.pathname) ? null : <Search />}
      {status === "authenticated" ? (
        <>
          {pathnames.includes(router.pathname) ? null : <TrendList />}
          <FollowRecommendations />
        </>
      ) : null}
    </div>
  );
};

export default Right;
