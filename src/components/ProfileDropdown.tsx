import { useSession } from "next-auth/react";
import React from "react";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";

const ProfileDropdown = ({ userId }: { userId: string; tabIndex: number }) => {
  const { data: userProfile } = trpc.user.getUserProfile.useQuery({
    userId,
  });
  const { data: session } = useSession();
  return (
    <div
      className="dropdown-content w-72 space-y-4 rounded-xl bg-base-100 p-4 shadow-xl"
      tabIndex={0}
    >
      <div className="flex items-start justify-between">
        <Avatar image={userProfile?.image as string} width={50} height={50} />
        {session?.user?.id !== userId ? (
          <button className="rounded-full bg-primary px-4 py-2 font-semibold text-white">
            Follow
          </button>
        ) : null}
      </div>
      <div>
        <p className="font-semibold">{userProfile?.name}</p>
        {userProfile?.handle ? (
          <p className="text-sm text-gray-500">@{userProfile?.handle}</p>
        ) : null}
      </div>
      <div>
        <p>{userProfile?.profile?.bio}</p>
      </div>
      <ul className="flex items-center gap-x-4 text-sm text-gray-500">
        <li>{userProfile?.followers.length} Followers</li>
        <li>{userProfile?.followings.length} Followings</li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
