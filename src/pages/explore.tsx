import React from "react";
import { v4 } from "uuid";
import Body from "../components/Body";
import Search from "../components/Search";
import TrendComponent from "../components/TrendComponent";
import { trpc } from "../utils/trpc";

const ExplorePage = () => {
  const { data } = trpc.hashtag.getTopHashtags.useQuery();
  console.log(data);
  return (
    <Body>
      <div className="p-2 md:p-4">
        <Search />
        <div className="mt-4 ">
          <h1 className="text-xl font-bold  ">Trends for you </h1>
          {data?.slice(0, 4).map((hashtag) => (
            <TrendComponent hashtag={hashtag} key={v4()} />
          ))}
        </div>
      </div>
    </Body>
  );
};

export default ExplorePage;
