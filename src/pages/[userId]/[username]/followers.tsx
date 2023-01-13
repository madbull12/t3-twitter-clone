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

const FollowerPage = () => {
  const { data: session } = useSession();

  const { userId } = useRouter().query;
  const { data: userFollowers } = trpc.follow.getUserFollowers.useQuery({
    userId: userId as string,
  });
  return (
    <Body>
      <FollowersFollowingNav />
      <div>
        {userFollowers?.map((followers) =>
          followers.followers.map((user) => (
            <PeopleComponent
              key={v4()}
              user={user.following as UserWithPayloads}
            />
          ))
        )}
      </div>
    </Body>
  );
};

export default FollowerPage;
