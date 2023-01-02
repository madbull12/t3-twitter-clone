import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React from "react";
import { useEditProfileModal } from "../../../lib/zustand";
import Avatar from "../../components/Avatar";
import Body from "../../components/Body";
import NavFeed from "../../components/NavFeed";
import { trpc } from "../../utils/trpc";
import { IoLocation } from 'react-icons/io5'
import { IoIosCalendar } from 'react-icons/io'

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
        <div className="h-full w-full bg-gray-200 relative">
          {userProfile?.profile?.coverPhoto ? <Image objectFit="cover" src={userProfile.profile.coverPhoto} layout="fill"  /> : null}
        </div>
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
        <p className="text-xs md:text-sm">{userProfile?.profile?.bio || "No bio added"}</p>
          
          <div className="mt-4 flex items-center gap-x-4 text-gray-500">
            <div className="flex items-center gap-x-2">
              <IoLocation />
              <p>{userProfile?.profile?.location}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <IoIosCalendar />
              {/* <p>{userProfile?.}</p> */}
            </div>

          </div>
      </div>
    </Body>
  );
};

export default ProfilePage;
