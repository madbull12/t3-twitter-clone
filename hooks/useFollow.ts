import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useLoginModal } from "../lib/zustand";
const useFollow = (userId: string) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { f, q, userId: _userId, listId } = router.query;
  const { mutateAsync:sendNotification } = trpc.notification.sendNotification.useMutation()
  const { data:session,status } = useSession()
  const invalidateFollowQueries = () => {
    utils.follow.getFollowersRecommendation.invalidate();
    utils.follow.getSingleFollower.invalidate({
      followingId: userId as string,
    });
    if (router.pathname === "/[userId]/[username]/followers") {
      utils.follow.getUserFollowers.invalidate({ userId: _userId as string });
    }
    if (router.pathname === "/[userId]/[username]/following") {
      utils.follow.getUserFollowing.invalidate({ userId: _userId as string });
    }
    utils.user.getUserProfile.invalidate({ userId: userId as string });
  };

  const optimizeMutation = () => {
    utils.user.getUserProfile.cancel({ userId: _userId as string });
    utils.follow.getSingleFollower.cancel({
      followingId: userId as string,
    });
    utils.follow.getFollowersRecommendation.cancel();
    if (router.pathname === "/[userId]/[username]/followers") {
      utils.follow.getUserFollowers.cancel({ userId: _userId as string });
    }
    if (router.pathname === "/[userId]/[username]/following") {
      utils.follow.getUserFollowing.cancel({ userId: _userId as string });
    }

    const getUserProfile = utils.user.getUserProfile.getData({
      userId: _userId as string,
    });
    const getSingleFollower = utils.follow.getSingleFollower.getData({
      followingId: userId as string,
    });

    const getFollowersRecommendation = utils.follow.getFollowersRecommendation.getData();
    const getUserFollowers =  utils.follow.getUserFollowers.getData({ userId: _userId as string });
    const getUserFollowing = utils.follow.getUserFollowing.getData({ userId: _userId as string });

    if(getUserProfile) {
      utils.user.getUserProfile.setData(getUserProfile)
    }
    if(getSingleFollower) {
      utils.follow.getSingleFollower.setData(getSingleFollower)
    }
    if(getFollowersRecommendation) {
      utils.follow.getFollowersRecommendation.setData(getFollowersRecommendation)
    }
    if(getUserFollowing) {
      utils.follow.getUserFollowing.setData(getUserFollowing)
    }
    if(getUserFollowers) {
      utils.follow.getUserFollowers.setData(getUserFollowers)
    }
  };

  const { mutateAsync: followUser, isLoading: followingUser } =
    trpc.follow.followUser.useMutation({
      onMutate: () => {
        optimizeMutation()
      },
      onSettled: () => {
        invalidateFollowQueries();
      },
    });
  const { mutateAsync: unfollowUser, isLoading: unfollowingUser } =
    trpc.follow.unfollowUser.useMutation({
      onMutate: () => {
        optimizeMutation()
      },
      onSettled: () => {
        invalidateFollowQueries();
      },
    });
  // const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
  //   followingId: userId as string,
  // },{
  //   onSettled:()=>{
  //     utils.follow.getSingleFollower.cancel({ followingId:userId as string });
  //   }
  // });
  const [followed, setFollowed] = useState<boolean>();
  const { setModal:setLoginModal } = useLoginModal();

  const handleFollow = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setFollowed(true);
    if(status!=="authenticated") {
      setLoginModal(true)
    } else {
      await toast.promise(followUser({ followingId: userId }), {
        success: "Following user",
        loading: "Loading...",
        error: (err) => `Oops something went wrong ` + err,
      });
      await sendNotification({ text:`${session?.user?.name} started following you`,redirectUrl:`/${session?.user?.id}/${session?.user?.name}`, recipientId:userId })
  
      
    }

  };
  const handleUnfollow = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setFollowed(false);
    if(status==="unauthenticated") {
      setLoginModal(true)

    } else {
      await toast.promise(unfollowUser({ followingId: userId }), {
        success: "User unfollowed",
        loading: "Unfollowing user",
        error: (err) => `Oops something went wrong ` + err,
      });
    }

  };

  return {
    handleFollow,
    handleUnfollow,
    followed,
    // alreadyFollowed,
    followingUser,
    unfollowingUser,
  };
};

export default useFollow;
