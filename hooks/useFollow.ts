import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/router";
const useFollow = (userId: string) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { mutateAsync: followUser, isLoading: followingUser } =
    trpc.follow.followUser.useMutation({
      onMutate: () => {
        utils.user.getUserProfile.cancel();
        const optimisticUpdate = utils.user.getUserProfile.getData();
        if (optimisticUpdate) {
          utils.user.getUserProfile.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.follow.getFollowersRecommendation.invalidate();
        if (router.pathname === "/[userId]/[username]/followers") {
          utils.follow.getUserFollowers.invalidate();
        }
        if (router.pathname === "/[userId]/[username]/following") {
          utils.follow.getUserFollowing.invalidate();
        }
        utils.user.getUserProfile.invalidate();
      },
    });
  const { mutateAsync: unfollowUser, isLoading: unfollowingUser } =
    trpc.follow.unfollowUser.useMutation({
      onMutate: () => {
        utils.user.getUserProfile.cancel();
        const optimisticUpdate = utils.user.getUserProfile.getData();
        if (optimisticUpdate) {
          utils.user.getUserProfile.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.follow.getFollowersRecommendation.invalidate();
        if (router.pathname === "/[userId]/[username]/followers") {
          utils.follow.getUserFollowers.invalidate();
        }
        if (router.pathname === "/[userId]/[username]/following") {
          utils.follow.getUserFollowing.invalidate();
        }
        utils.user.getUserProfile.invalidate();
      },
    });
  const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
    followingId: userId as string,
  });
  const [followed, setFollowed] = useState<boolean>();

  const handleFollow = async () => {
    setFollowed(true);
    await toast.promise(followUser({ followingId: userId }), {
      success: "Following user",
      loading: "Loading...",
      error: (err) => `Oops something went wrong ` + err,
    });
  };
  const handleUnfollow = async () => {
    setFollowed(false);
    await toast.promise(unfollowUser({ followingId: userId }), {
      success: "User unfollowed",
      loading: "Unfollowing user",
      error: (err) => `Oops something went wrong ` + err,
    });
  };

  return {
    handleFollow,
    handleUnfollow,
    followed,
    alreadyFollowed,
    followingUser,
    unfollowingUser,
  };
};

export default useFollow;
