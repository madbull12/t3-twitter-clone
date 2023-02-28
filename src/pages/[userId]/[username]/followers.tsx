import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { v4 } from "uuid";
import { UserWithPayloads } from "../../../../interface";
import Body from "../../../components/Body";
import FollowersFollowingNav from "../../../components/FollowersFollowingNav";
import NavFeed from "../../../components/NavFeed";
import PeopleComponent from "../../../components/PeopleComponent";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import Loader from "../../../components/Loader";
import useScrollPosition from "../../../../hooks/useScrollPosition";
import UsersList from "../../../components/UsersList";

const FollowerPage = () => {
  const { userId, username } = useRouter().query;
  // const { data: userFollowing, isLoading } =
  //   trpc.follow.getUserFollowing.useQuery({
  //     userId: userId as string,
  //   });
  const scrollPosition = useScrollPosition();

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    trpc.follow.getInfiniteUserFollowers.useInfiniteQuery(
      {
        limit: 6,
        userId: userId as string,
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

  return (
    <Body>
      <FollowersFollowingNav />
      {users?.length !== 0 ? (
        <div>
          <UsersList users={users as UserWithPayloads[]} />
          {isFetching && hasNextPage ? (
            <div className="pb-16">
              <Loader />
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {session?.user?.id === userId ? (
            <div className="relative mx-auto flex w-2/3 flex-col  items-center">
              <Image
                width={500}
                height={250}
                alt="No followers"
                src="/no-followers.png"
              />
              <h1 className="text-4xl font-bold text-neutral">
                Looking for followers?
              </h1>
              <p className="text-gray-500">
                When someone follows this account, they'll show up here.
                Tweeting and interacting with others helps boost followers.
              </p>
            </div>
          ) : null}
        </>
      )}
    </Body>
  );
};

export default FollowerPage;
