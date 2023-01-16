import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React from "react";
import { v4 } from "uuid";
import { UserWithPayloads } from "../../../../interface";
import Body from "../../../components/Body";
import FollowersFollowingNav from "../../../components/FollowersFollowingNav";
import Loader from "../../../components/Loader";
import NavFeed from "../../../components/NavFeed";
import PeopleComponent from "../../../components/PeopleComponent";
import { trpc } from "../../../utils/trpc";

const FollowingPage = () => {
  const { data: session, status } = useSession();
  const { userId, username } = useRouter().query;
  const { data: userFollowing, isLoading } =
    trpc.follow.getUserFollowing.useQuery({
      userId: userId as string,
    });

  if (isLoading) return <Loader />;

  return (
    <Body>
      <FollowersFollowingNav />

      {userFollowing?.followings.length !== 0 ? (
        <div>
          {userFollowing?.followings.map((following) => (
            <PeopleComponent user={following.follower} />
          ))}
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
