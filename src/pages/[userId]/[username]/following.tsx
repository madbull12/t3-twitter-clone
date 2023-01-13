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
  const { data: session } = useSession();
  const { userId, username } = useRouter().query;
  const { data: userFollowing,isLoading } = trpc.follow.getUserFollowing.useQuery({
    userId: userId as string,
  });

  if(isLoading) return <Loader />

  return (
    <Body>
      <FollowersFollowingNav />

      {userFollowing?.followings.length !== 0 ? (
        <div>
          {userFollowing?.followings.map((follower) => (
            <PeopleComponent user={follower.follower} />
          ))}
        </div>
      ) : (
        <div className="relative flex w-2/3 mx-auto flex-col gap-y-4  items-center">
 
          <h1 className="text-4xl font-bold text-neutral">
            Be in the know
          </h1>
          <p className="text-gray-500">
          Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.
          </p>
        </div>
      )}
    </Body>

  );
};

export default FollowingPage;
