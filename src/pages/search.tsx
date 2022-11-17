import { useRouter } from "next/router";
import React from "react";
import Body from "../components/Body";
import Loader from "../components/Loader";
import SearchHeader from "../components/SearchHeader";
import TweetComponent from "../components/TweetComponent";
import { trpc } from "../utils/trpc";
import { User } from "@prisma/client";
import PeopleComponent from "../components/PeopleComponent";
import NoResults from "../components/NoResults";

const SearchPage = () => {
  const router = useRouter();
  const term = router.query.q as string;
  const { data: searchResults, isLoading } = trpc.tweet.searchTweets.useQuery({
    term,
    filtering: router.query.f as string,
  });
  const { data: searchUsers, isLoading: isUserLoading } =
    trpc.user.searchUsers.useQuery({
      term,
    });

  console.log(searchResults);
  return (
    <Body>
      <SearchHeader />
      {isLoading ? <Loader /> : null}

      {router.query.f !== "people" ? (
        <>
          {searchResults?.length === 0 ? (
            <NoResults />
          ) : (
            <>
              {searchResults?.map((result) => (
                <TweetComponent tweet={result} />
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {searchUsers?.length === 0 ? (
            <NoResults />
          ) : (
            <>
              {searchUsers?.map((user) => (
                <PeopleComponent user={user} />
              ))}
            </>
          )}
        </>
      )}
    </Body>
  );
};

export default SearchPage;
