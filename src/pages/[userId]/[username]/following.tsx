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

const FollowingPage = () => {
  const { data: session } = useSession();
  const { userId, username } = useRouter().query;
  const { data: userFollowing } = trpc.follow.getUserFollowing.useQuery({
    userId: userId as string,
  });
  console.log(
    userFollowing?.map((following) => following.followings.map((user) => user))
  );

  return (
    <Body>
      <FollowersFollowingNav />
      {userFollowing?.map((following) =>
        following.followings.map((user) => (
          <PeopleComponent key={v4()} user={user.follower as unknown as UserWithPayloads} />
        ))
      )}

    </Body>
  );
};

export default FollowingPage;
