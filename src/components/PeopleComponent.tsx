import { UserWithPayloads } from "../../interface";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useFollow from "../../hooks/useFollow";
import { GoVerified } from 'react-icons/go'
import { trpc } from "../utils/trpc";
interface IProps {
  user: UserWithPayloads;
}
const PeopleComponent = ({ user }: IProps) => {
  const { data: session, status } = useSession();
  const [unfollowHovered, setUnfollowHovered] = useState<boolean>(false);
  const router = useRouter();
  const {
    handleFollow,
    handleUnfollow,
    // alreadyFollowed,
    followed,
    followingUser,
    unfollowingUser,
  } = useFollow(user.id as string);
  
  const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
    followingId: user.id as string,
  });
  return (
    <div onClick={() => router.push(`/${user.id}/${user.name}`)}>
      <div className="flex cursor-pointer items-start justify-between gap-x-4 px-2 py-6 transition-all duration-100 ease-in-out hover:bg-base-200">
        <Avatar image={user.image || ""} width={40} height={40} />
        <div className="mr-auto truncate ">
          <div className="flex items-center gap-x-1">
          <Link
            className="text-lg font-semibold  hover:underline"
            href={`/${user.id}/${user.name}`}
          >
            {user.name}
          </Link>
          {user?.isVerified ? (
          <GoVerified className="text-primary" />

          ):null}
          </div>
     
          {user.handle ? (
          <p className="text-gray-500 text-sm truncate">@{user.handle}</p>

          ):null}
          {router.pathname==="/connect_people" ? <p className="text-sm">{user.profile?.bio}</p> : null}

        </div>
        {session?.user?.id !== user.id ? (
          <>
            {(alreadyFollowed !== null || followed) &&
            status === "authenticated" ? (
              <button
                disabled={unfollowingUser || followingUser}
                onClick={handleUnfollow}
                onMouseEnter={() => setUnfollowHovered(true)}
                onMouseLeave={() => setUnfollowHovered(false)}
                className={` ${
                  unfollowHovered
                    ? "border-red-600 bg-transparent text-red-600"
                    : null
                } ml-auto  rounded-full  border border-primary bg-primary px-4 py-2  font-semibold  text-white`}
              >
                {unfollowHovered ? "Unfollow" : "Following"}
              </button>
            ) : (
              <button
                disabled={unfollowingUser || followingUser}
                onClick={handleFollow}
                className="ml-auto rounded-full bg-primary py-1 px-2 md:px-4 md:py-2 font-semibold text-white "
              >
                Follow
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PeopleComponent;
