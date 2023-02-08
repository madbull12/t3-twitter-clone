import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  useEditProfileModal,
  usePhotoView,
  usePhotoViewModal,
} from "../../../../lib/zustand";
import Avatar from "../../../components/Avatar";
import Body from "../../../components/Body";
import NavFeed from "../../../components/NavFeed";
import { trpc } from "../../../utils/trpc";
import { IoEllipsisHorizontalCircleOutline, IoLocation } from "react-icons/io5";
import { IoIosCalendar, IoIosLink, IoIosListBox } from "react-icons/io";
import moment from "moment";
import { AiOutlineLink } from "react-icons/ai";
import Link from "next/link";
import TweetList from "../../../components/TweetList";
import { TweetWithUser } from "../../../../interface";
import Loader from "../../../components/Loader";
import Head from "next/head";
import useFollow from "../../../../hooks/useFollow";
import { toast } from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import { GoVerified } from "react-icons/go";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setModal } = useEditProfileModal();
  const [_link, setLink] = useState<string>("");
  const { setModal: setPhotoViewModal } = usePhotoViewModal();
  const { setSrc, setSize } = usePhotoView();

  const tweetLinks = [
    {
      name: "Tweets",
      slug: "",
    },
    {
      name: "Tweets & replies",
      slug: "tweets&replies",
    },
    {
      name: "Media",
      slug: "media",
    },
    {
      name: "Likes",
      slug: "likes",
    },
  ];

  const { username, userId } = router.query;
  const [unfollowHovered, setUnfollowHovered] = useState<boolean>(false);

  const { data: userTweets, isLoading: isLoadingUserTweets } =
    trpc.tweet.getUserTweets.useQuery({
      userId: userId as string,
      link: _link,
    });
  const { data: userProfile, isLoading: isLoadingUserProfile } =
    trpc.user.getUserProfile.useQuery({
      userId: userId as string,
    });
  const { data: userTweetsCount } = trpc.tweet.getUserTweets.useQuery({
    userId: userId as string,
    link: "tweets&replies",
  });
  const { data: alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({
    followingId: userId as string,
  });
  const [value, copy] = useCopyToClipboard();
  const {
    handleFollow,
    handleUnfollow,
    // alreadyFollowed,
    followed,
    unfollowingUser,
    followingUser,
  } = useFollow(userId as string);
  if (isLoadingUserProfile) return <Loader />;

  return (
    <Body>
      <Head>
        <title>{username} - Profile</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavFeed
        subtitle={`${userTweetsCount?.length} tweets`}
        title={username as string}
      />
      <div className="relative h-48 w-full">
        <div className="relative h-full w-full bg-gray-200">
          {userProfile?.profile?.coverPhoto ? (
            <Image
              objectFit="cover"
              src={userProfile.profile.coverPhoto}
              layout="fill"
              onClick={() => {
                setPhotoViewModal(true);
                setSrc(userProfile.profile?.coverPhoto || ("" as string));
                setSize("medium");
              }}
            />
          ) : null}
        </div>
      </div>
      <div className="flex items-start justify-between px-2 md:px-4 ">
        <div
          className="-mt-16 "
          onClick={() => {
            setPhotoViewModal(true);
            setSrc(userProfile?.image as string);
            setSize("medium");
          }}
        >
          <Avatar
            image={userProfile?.image as string}
            width={140}
            height={140}
          />
        </div>
        {session?.user?.id === userId ? (
          <button
            onClick={() => setModal(true)}
            className="mt-4 whitespace-nowrap rounded-full border border-gray-300 bg-transparent px-2 py-1 text-xs font-semibold hover:bg-base-300 sm:px-4 sm:py-2 sm:text-base"
          >
            Edit profile
          </button>
        ) : (
          <div className="mt-4 flex items-center ">
            <div className="dropdown-bottom dropdown-end dropdown">
              <label
                tabIndex={0}
                className="btn m-1 border-none  bg-transparent text-neutral hover:bg-transparent"
              >
                <IoEllipsisHorizontalCircleOutline className="cursor-pointer text-3xl " />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 font-bold shadow"
              >
                <li>
                  <button
                    onClick={() => {
                      toast.success("Profile link copied to clipboard");

                      copy(
                        `${
                          process.env.NODE_ENV === "development"
                            ? "localhost:3000"
                            : "t3-twitter-clone-nine.vercel.app"
                        }/${userId}/${username}`
                      );
                    }}
                    className="flex items-center gap-x-2 rounded-xl p-2 font-bold "
                  >
                    <IoIosLink />

                    <a>Copy link to profile</a>
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-x-2 rounded-xl p-2 font-bold ">
                    <IoIosListBox />
                    <Link href={`/list/${userId}`}>View User's list</Link>
                  </button>
                </li>
              </ul>
            </div>
            {(alreadyFollowed !== null || followed) &&
            status === "authenticated" ? (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={handleUnfollow}
                  onMouseEnter={() => setUnfollowHovered(true)}
                  onMouseLeave={() => setUnfollowHovered(false)}
                  disabled={unfollowingUser || followingUser}
                  className={` ${
                    unfollowHovered
                      ? "border-red-600 bg-transparent text-red-600"
                      : null
                  } ml-auto  rounded-full  border border-primary bg-primary px-4 py-2  font-semibold  text-white`}
                >
                  {unfollowHovered ? "Unfollow" : "Following"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleFollow}
                disabled={unfollowingUser || followingUser}
                className="ml-auto rounded-full bg-primary px-4 py-2 font-semibold text-white "
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-2 md:p-4">
        <div className="flex items-center gap-x-1">
          <p className="text-lg font-bold md:text-2xl">{userProfile?.name}</p>
          {userProfile?.isVerified ? (
            <GoVerified className="text-primary" />
          ) : null}
        </div>
        {userProfile?.handle ? (
          <p className="mb-2 text-sm text-gray-400">@{userProfile?.handle}</p>
        ) : null}
        {userProfile?.email ? (
          <p className="text-gray-400">{userProfile?.email}</p>
        ) : null}
        <p className="text-xs md:text-sm">
          {userProfile?.profile?.bio || "No bio added"}
        </p>

        <div className="mt-4 flex flex-col items-start gap-x-4 text-sm text-gray-500 sm:flex-row sm:items-center md:text-base">
          <div className="flex items-center gap-x-2">
            <IoLocation />
            <p>{userProfile?.profile?.location}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <AiOutlineLink />
            <Link
              className="text-primary hover:underline"
              target="_blank"
              href={(userProfile?.profile?.website as string) ?? ""}
            >
              {userProfile?.profile?.website}
            </Link>
          </div>

          <div className="flex items-center gap-x-2">
            <IoIosCalendar />
            <p>
              Joined in {moment(userProfile?.createdAt as Date).format("ll")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2 p-2 text-gray-400 md:p-4">
        <p
          className="flex cursor-pointer items-center gap-x-2 text-sm "
          onClick={() =>
            router.push(`${router.asPath}/following`, undefined, {
              shallow: true,
            })
          }
        >
          <span className="font-semibold text-neutral">
            {userProfile?.followings.length}
          </span>
          Followings
        </p>
        <p
          className="flex cursor-pointer items-center gap-x-2 text-sm"
          onClick={() =>
            router.push(`${router.asPath}/followers`, undefined, {
              shallow: true,
            })
          }
        >
          <span className="font-semibold text-neutral ">
            {userProfile?.followers.length}
          </span>
          Followers
        </p>
      </div>
      <nav className="mt-4 flex list-none items-center justify-between gap-x-2 whitespace-nowrap px-2 text-xs font-semibold xs:text-sm sm:gap-x-4 md:px-4 md:text-base">
        {tweetLinks.map((link) => (
          <li
            className={`cursor-pointer text-gray-500 ${
              link.slug === _link ? "border-b-4 border-primary" : null
            }`}
            onClick={() => setLink(link.slug)}
          >
            {link.name}
          </li>
        ))}
      </nav>
      {!isLoadingUserTweets ? (
        <>
          {userTweets?.length !== 0 ? (
            <TweetList tweets={userTweets as TweetWithUser[]} />
          ) : (
            <h1 className="flex items-center justify-center py-16  text-2xl font-bold">
              No tweets
            </h1>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Body>
  );
};

export default ProfilePage;
