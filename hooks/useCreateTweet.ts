import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { trpc } from "../src/utils/trpc";
import { useState, useEffect, useRef } from "react";
import useMediaUpload from "./useMediaUpload";
import { useRouter } from "next/router";
const useCreateTweet = () => {
  const { data: session, status } = useSession();
  const router = useRouter()
  const utils = trpc.useContext();
  const {
    upload,
    selectedFile,
    setSelectedFile,
    mediaUrl
  } = useMediaUpload();

  console.log(selectedFile)

  const { mutateAsync: createTweet } = trpc.tweet.createTweet.useMutation({
    // onMutate: () => {
    //   utils.tweet.getInfiniteTweets.cancel();
    //   const optimisticUpdate = utils.tweet.getInfiniteTweets.getData();
    //   if (optimisticUpdate) {
    //     utils.tweet.getInfiniteTweets.setData(optimisticUpdate);
    //   }
    // },
    onSettled: () => {
      utils.tweet.getInfiniteTweets.invalidate();
      
    },

   
  });

  const [text, setText] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  // console.log(selectedFile);
  // console.log(text.split(" ").filter((word)=>word.startsWith("#")).map((word)=>word.slice(1)))
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    let hashtags = text
      .split(" ")
      .filter((word) => word.startsWith("#"))
      .map((word) => word.slice(1));

    //upload image
    console.log(selectedFile)
    if (selectedFile) {
      upload()
    }

    toast.promise(createTweet({ text, mediaUrl, hashtags }), {
      success: "Tweet created",
      loading: "Creating tweet",
      error: (err) => "Oops.. something went wrong " + err,
    });

    textRef!.current!.value = "";
    setSelectedFile(undefined);
  };
   
  return { handleSubmit,setText,textRef };
};

export default useCreateTweet;
