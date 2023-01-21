import { useSession } from "next-auth/react";
import React from "react";
import { UserWithPayloads } from "../../interface";
import Body from "../components/Body";
import NavFeed from "../components/NavFeed";
import PeopleComponent from "../components/PeopleComponent";
import { trpc } from "../utils/trpc";

const connect_people = () => {
  const { data } = trpc.follow.getFollowersRecommendation.useQuery();
  const { data: session } = useSession();
  return (
    <Body>
        <NavFeed title="Connect" />
      {data
        ?.filter((user) => user.id !== session?.user?.id)
        .map((user: unknown) => (
          <PeopleComponent user={user as unknown as UserWithPayloads} />
        ))}
    </Body>
  );
};

export default connect_people;