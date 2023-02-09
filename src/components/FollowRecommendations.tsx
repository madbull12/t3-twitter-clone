import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UserWithPayloads } from "../../interface";
import { trpc } from "../utils/trpc";
import PeopleComponent from "./PeopleComponent";

const FollowRecommendations = () => {
  const { data } = trpc.follow.getFollowersRecommendation.useQuery();
  const { data: session } = useSession();
  const router = useRouter()
  return (
    <div className="rounded-xl overflow-hidden bg-base-250 border border-gray-300 border-opacity-20">
      <h1 className="p-4 text-2xl font-bold text-neutral">Who to follow</h1>
      {data
        ?.filter((user) => user.id !== session?.user?.id)
        .slice(0,3)
        .map((user:unknown) => (
          <PeopleComponent user={user as unknown as UserWithPayloads} />
        ))}
        <div onClick={()=>router.push("/connect_people")}  className="text-primary hover:bg-base-200 p-4 cursor-pointer">
          Show more
        </div>
    </div>
  );
};

export default FollowRecommendations;
