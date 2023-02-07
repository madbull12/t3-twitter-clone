import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/router";
const useFollow = (userId: string) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { f, q,userId:_userId } = router.query;

  const { mutateAsync: followUser, isLoading: followingUser } =
    trpc.follow.followUser.useMutation({
      onMutate: () => {
        utils.user.getUserProfile.cancel();
        const optimisticUpdate = utils.user.getUserProfile.getData({ userId:_userId as string });
        if (optimisticUpdate) {
          utils.user.getUserProfile.setData(optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.follow.getFollowersRecommendation.invalidate();
        utils.follow.getSingleFollower.invalidate({
          followingId: userId as string,
        });
        if (router.pathname === "/[userId]/[username]/followers") {
          utils.follow.getUserFollowers.invalidate({ userId:_userId as string });
        }
        if (router.pathname === "/[userId]/[username]/following") {
          utils.follow.getUserFollowing.invalidate({ userId:_userId as string });
        }
        utils.user.getUserProfile.invalidate({ userId:userId as string });
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
        utils.follow.getSingleFollower.invalidate({
          followingId: userId as string,
        });
        if (router.pathname === "/[userId]/[username]/followers") {
          utils.follow.getUserFollowers.invalidate({ userId:_userId as string });
        }
        if (router.pathname === "/[userId]/[username]/following") {
          utils.follow.getUserFollowing.invalidate({ userId:_userId as string });
        }
        utils.user.getUserProfile.invalidate({ userId:_userId as string });
      },
    });
  const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
    followingId: userId as string,
  });
  const [followed, setFollowed] = useState<boolean>();

  const handleFollow = async (e:React.SyntheticEvent) => {
    e.stopPropagation()
    setFollowed(true);
    await toast.promise(followUser({ followingId: userId }), {
      success: "Following user",
      loading: "Loading...",
      error: (err) => `Oops something went wrong ` + err,
    });
  };
  const handleUnfollow = async (e:React.SyntheticEvent) => {
    e.stopPropagation()
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
