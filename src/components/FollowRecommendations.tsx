import { useSession } from "next-auth/react";
import React from "react";
import { UserWithPayloads } from "../../interface";
import { trpc } from "../utils/trpc";
import PeopleComponent from "./PeopleComponent";

const FollowRecommendations = () => {
  const { data } = trpc.follow.getFollowersRecommendation.useQuery();
  const { data: session } = useSession();
  return (
    <div className="rounded-lg bg-base-200">
      <h1 className="p-4 text-2xl font-bold text-neutral">Who to follow</h1>
      {data
        ?.filter((user) => user.id !== session?.user?.id)
        .map((user:unknown) => (
          <PeopleComponent user={user as unknown as UserWithPayloads} />
        ))}
    </div>
  );
};

export default FollowRecommendations;
