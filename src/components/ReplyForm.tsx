import { useSession } from "next-auth/react";
import { useState,useRef,useEffect } from 'react'
import toast from "react-hot-toast";
import { RiCloseLine } from "react-icons/ri";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";
import Button from "./Button";
import MediaTools from "./MediaTools";
const ReplyForm = ({ tweetId }: { tweetId: string }) => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  const utils = trpc.useContext();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: createReply } = trpc.reply.createReply.useMutation({
    onMutate: () => {
      utils.tweet.getTweets.cancel();
      const optimisticUpdate = utils.tweet.getSingleTweet.getData({ tweetId });
      if (optimisticUpdate) {
        utils.tweet.getSingleTweet.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getTweets.invalidate();
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let mediaUrl = null;

    //upload image
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "xap2a5k4");
      // formData.append("file", );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dem2vt6lj/${
          selectedFile.type === "video/mp4" ? "video" : "image"
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      mediaUrl = res.secure_url;
    }

    toast.promise(createReply({ text, mediaUrl, tweetId }), {
      success: "Reply created",
      loading: "Replying...",
      error: (err) => "Oops.. something went wrong " + err,
    });

    textRef!.current!.value = "";
    setSelectedFile(undefined);
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="flex items-start gap-x-4">
        <Avatar image={session?.user?.image || ""} />
        <textarea
          ref={textRef}
          cols={50}
          
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-none text-xl outline-none"
          placeholder="Tweet your reply"
        />
      </div>
      {selectedFile && (
        <>
          {selectedFile.type === "video/mp4" ? (
            <video controls className="relative h-full w-full rounded-2xl">
              <source src={preview} type="video/mp4"></source>
            </video>
          ) : (
            <div className="relative">
              <img src={preview} />
              <div
                onClick={() => setSelectedFile(undefined)}
                className="absolute top-4 right-4  grid h-8 w-8  cursor-pointer  place-items-center rounded-full bg-[#00000083] text-xl text-white"
              >
                <RiCloseLine />
              </div>
            </div>
          )}
        </>
      )}
      <div className="mt-4 flex items-center gap-x-64 ">
        <div className="mr-auto">
          <MediaTools onSelectFile={onSelectFile} />
        </div>

        <Button text="Reply" />
      </div>
    </form>
  );
};

export default ReplyForm;