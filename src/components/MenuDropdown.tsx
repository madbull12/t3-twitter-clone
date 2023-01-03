import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-hot-toast";
import { BiDotsHorizontal } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import useMediaQuery from "../../hooks/useMediaQuery";
import { trpc } from "../utils/trpc";

const MenuDropdown = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();
  const { data: userTweets } = trpc.tweet.getUserTweets.useQuery({
    userId: session?.user?.id as string,
    link: "tweets&replies",
  });

  const { mutateAsync: deleteTweet } = trpc.tweet.deleteTweet.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getTweets.getData();
      if (optimisticUpdate) {
        utils.tweet.getTweets.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getTweets.invalidate();
    },
  });

  const isYourTweet = !!userTweets?.find((tweet) => tweet.id === tweetId);
  console.log(isYourTweet);
  const handleDeleteTweet = async () => {
    toast.promise(deleteTweet({ tweetId }), {
      success: "Tweet deleted",
      loading: "Deleting tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });
  };
  const tablet = useMediaQuery("(min-width:768px)");

  return (
    <div className="dropdown ">
      {tablet ? (
        <label tabIndex={0} className=" relative  cursor-pointer ">
          <BiDotsHorizontal className="text-xl text-gray-400" />
        </label>
      ) : (
        <label htmlFor="my-modal-6">
          <BiDotsHorizontal className="text-xl text-gray-400" />
        </label>
      )}

      {tablet ? (
        <>
          {isYourTweet ? (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box absolute  top-0 w-52 bg-base-100 p-2 shadow"
            >
              <li onClick={handleDeleteTweet}>
                <a className="text-red-500">Delete</a>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box absolute top-0 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a>Bookmark</a>
              </li>
            </ul>
          )}{" "}
        </>
      ) : (
        <>
          <input type="checkbox" id="my-modal-6" className="modal-toggle" />

          <div className="modal modal-bottom md:modal-middle">
            <div className="modal-box flex flex-col items-center">
              {isYourTweet ? (
                <h3
                  className="text-lg font-bold text-red-500"
                  onClick={handleDeleteTweet}
                >
                  Delete
                </h3>
              ) : (
                <h3 className="text-lg font-bold ">Bookmark</h3>
              )}

              <div className="modal-action self-end">
                <label htmlFor="my-modal-6">
                  <IoMdClose className="text-xl" />
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuDropdown;
