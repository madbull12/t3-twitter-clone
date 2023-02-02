import React from "react";
import { toast } from "react-hot-toast";
import { BiDotsHorizontal } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { trpc } from "../utils/trpc";

const BottomMenuModal = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const utils = trpc.useContext();
  const { data: singleTweet } = trpc.tweet.getUniqueTweet.useQuery({
    tweetId,
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

  //   const isYourTweet = !!singleTweet;
  const handleDeleteTweet = async () => {
    toast.promise(deleteTweet({ tweetId }), {
      success: "Tweet deleted",
      loading: "Deleting tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });
  };
  return (
    <>
      <label htmlFor="my-modal-6">
        <BiDotsHorizontal className="text-xl text-gray-400" />
      </label>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom md:modal-middle">
        <div className="modal-box flex flex-col items-center">
          {singleTweet !== null ? (
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
  );
};

export default BottomMenuModal;
