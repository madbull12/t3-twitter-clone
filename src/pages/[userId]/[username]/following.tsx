import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React,{ useEffect } from "react";
import { v4 } from "uuid";
import useScrollPosition from "../../../../hooks/useScrollPosition";
import { UserWithPayloads } from "../../../../interface";
import Body from "../../../components/Body";
import FollowersFollowingNav from "../../../components/FollowersFollowingNav";
import Loader from "../../../components/Loader";
import NavFeed from "../../../components/NavFeed";
import PeopleComponent from "../../../components/PeopleComponent";
import UsersList from "../../../components/UsersList";
import { trpc } from "../../../utils/trpc";

const FollowingPage = () => {
  const { userId, username } = useRouter().query;
  // const { data: userFollowing, isLoading } =
  //   trpc.follow.getUserFollowing.useQuery({
  //     userId: userId as string,
  //   });
  const scrollPosition = useScrollPosition();
  
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    trpc.follow.getInfiniteUserFollowing.useInfiniteQuery(
      {
        limit: 6,
        userId:userId as string
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, isFetching, hasNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.users) ?? [];
  const router = useRouter();
  const { data: session, status } = useSession();
  if (isLoading) return <Loader />;

  return (
    <Body>
      <FollowersFollowingNav />

      {users?.length !== 0 ? (
        <div>
          <UsersList users={users as UserWithPayloads[]} />
          {isFetching && hasNextPage ?(
          <div className="pb-16">
            <Loader />
          </div>
        )  : null}
        </div>
      ) : (
        <>
          {session?.user?.id === userId ? (
            <div className="relative mx-auto flex w-2/3 flex-col items-center  gap-y-4">
              <h1 className="text-4xl font-bold text-neutral">
                Be in the know
              </h1>
              <p className="text-gray-500">
                Following accounts is an easy way to curate your timeline and
                know what’s happening with the topics and people you’re
                interested in.
              </p>
            </div>
          ) : null}
        </>
      )}
    </Body>
  );
};

export default FollowingPage;
