import React from "react";
import { v4 } from "uuid";
import { trpc } from "../utils/trpc";
import TrendComponent from "./TrendComponent";

const TrendList = () => {
  const { data } = trpc.hashtag.getTopHashtags.useQuery();

  return (
    <div className="bg-base-250 rounded-lg">
      <h1 className="text-2xl font-bold text-neutral p-4">Trends for you </h1>
      {data?.slice(0, 4).map((hashtag) => (
        <TrendComponent hashtag={hashtag} key={v4()} />
      ))}
    </div>
  );
};

export default TrendList;
