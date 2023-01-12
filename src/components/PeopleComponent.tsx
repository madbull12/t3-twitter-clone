import { UserWithPayloads } from "../../interface";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface IProps {
  user: UserWithPayloads;
}
const PeopleComponent = ({ user }: IProps) => {
  const { data: session } = useSession();
  const [followed, setFollowed] = useState<boolean>(false);
  const [unfollowHovered,setUnfollowHovered] =  useState<boolean>(false);
  const router = useRouter();
  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(!followed);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(true)
  };

  const handleUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(false)

  };
  return (
    <div onClick={() => router.push(`/${user.id}/${user.name}`)}>
      <div className="flex cursor-pointer items-start justify-between gap-x-4 p-2 transition-all duration-100 ease-in-out hover:bg-base-200">
        <Avatar image={user.image || ""} width={40} height={40} />
        <div className="mr-auto">
          <Link
            className="text-lg font-semibold hover:underline"
            href={`/${user.id}/${user.name}`}
          >
            {user.name}
          </Link>
          <p>{user.profile?.bio}</p>
        </div>
        {session?.user?.id !== user.id ? (
          <>
            {followed ? (
              <button
                onClick={handleUnfollow}
                onMouseEnter={()=>setUnfollowHovered(true)}
                onMouseLeave={()=>setUnfollowHovered(false)}
                className={` ${unfollowHovered ? "text-red-600 border-red-600 bg-transparent" : null} ml-auto  rounded-full  bg-primary px-4 py-2 font-semibold text-white  border  border-primary`}
              >
                {unfollowHovered ? "Unfollow" : "Following"}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="ml-auto rounded-full bg-primary px-4 py-2 font-semibold text-white "
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
