import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { v4 } from "uuid";
import { UserWithPayloads } from "../../../../interface";
import Body from "../../../components/Body";
import FollowersFollowingNav from "../../../components/FollowersFollowingNav";
import NavFeed from "../../../components/NavFeed";
import PeopleComponent from "../../../components/PeopleComponent";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import Loader from "../../../components/Loader";

const FollowerPage = () => {
  const { data: session, status } = useSession();

  const { userId } = useRouter().query;
  const { data: userFollowers, isLoading } =
    trpc.follow.getUserFollowers.useQuery({
      userId: userId as string,
    });

  if (isLoading) return <Loader />;

  return (
    <Body>
      <FollowersFollowingNav />
      {userFollowers?.followers.length !== 0 ? (
        <div>
          {userFollowers?.followers.map((follower) => (
            <PeopleComponent key={v4()} user={follower.following} />
          ))}
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
