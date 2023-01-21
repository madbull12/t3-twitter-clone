import React from "react";
import { v4 } from "uuid";
import Body from "../components/Body";
import NavFeed from "../components/NavFeed";
import TrendComponent from "../components/TrendComponent";
import { trpc } from "../utils/trpc";

const TrendPage = () => {
  const { data } = trpc.hashtag.getTopHashtags.useQuery();

  return (
    <Body>
      <NavFeed title="Trends" />
      {data?.map((hashtag) => (
        <TrendComponent hashtag={hashtag} key={v4()} />
      ))}
    </Body>
  );
};

export default TrendPage;
