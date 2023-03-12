import { useSession } from "next-auth/react";
import React,{ useState } from "react";
import useFollow from "../../hooks/useFollow";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";

const ProfileDropdown = ({ userId }: { userId: string; tabIndex: number }) => {
  const { data: userProfile } = trpc.user.getUserProfile.useQuery({
    userId,
  });
  const [unfollowHovered, setUnfollowHovered] = useState<boolean>(false);

  const {
    handleFollow,
    handleUnfollow,
    // alreadyFollowed,
    followed,
    followingUser,
    unfollowingUser,
  } = useFollow(userId as string);
  
  const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
    followingId: userId as string,
  });
  const { data: session,status } = useSession();

  if(status==="unauthenticated") return null
  return (
    <div
      className="dropdown-content w-72 space-y-4 rounded-xl bg-base-100 p-4 shadow-xl"
      tabIndex={0}
    >
      <div className="flex items-start justify-between">
        <Avatar image={userProfile?.image as string} width={50} height={50} />
        {session?.user?.id !== userId ? (
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
                className="ml-auto rounded-full bg-primary px-4 py-2 font-semibold text-white "
              >
                Follow
              </button>
            )}
          </>
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
