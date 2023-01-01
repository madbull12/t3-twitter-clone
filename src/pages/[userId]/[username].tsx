import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { useEditProfileModal } from "../../../lib/zustand";
import Avatar from "../../components/Avatar";
import Body from "../../components/Body";
import NavFeed from "../../components/NavFeed";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setModal } = useEditProfileModal();

  const { username, userId } = router.query;

  const { data: userTweets } = trpc.tweet.getUserTweets.useQuery({
    userId: userId as string,
  });
  const { data: userProfile } = trpc.user.getUserProfile.useQuery({
    userId: userId as string,
  });


  console.log(userProfile);

  return (
    <Body>
      <NavFeed tweets={userTweets?.length} title={username as string} />
      <div className="relative h-48 w-full">
        <div className="h-full w-full bg-gray-200"></div>
      </div>
      <div className="flex items-start justify-between px-2 md:px-4 ">
        <div className="-mt-16 ">
          <Avatar
            image={userProfile?.image as string}
            width={140}
            height={140}
          />
        </div>
        {session?.user?.id === userId ? (
          <button onClick={()=>setModal(true)} className="mt-4 rounded-full border border-gray-300 bg-transparent px-4 py-2 font-semibold hover:bg-gray-200">
            Edit profile
          </button>
        ) : null}
      </div>
      <div className="p-2 md:p-4">
        <p className="text-lg font-bold md:text-2xl">{userProfile?.name}</p>
        <p className="text-gray-400">{userProfile?.email}</p>
        <p className="text-xs md:text-sm">{userProfile?.profile?.bio}</p>
      </div>
    </Body>
  );
};

export default ProfilePage;
