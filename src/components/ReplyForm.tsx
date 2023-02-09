import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { RiCloseLine } from "react-icons/ri";
import { TweetWithUser } from "../../interface";
import { useReplyModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";
import Button from "./Button";
import MediaTools from "./MediaTools";

const ReplyForm = ({ tweet }: { tweet: TweetWithUser }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [newReply, setNewReply] = useState<TweetWithUser | null>(null);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  const utils = trpc.useContext();
  const { setModal } = useReplyModal();
  const { mutateAsync: sendNotification } =
    trpc.notification.sendNotification.useMutation();

  const textRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: createReply } = trpc.tweet.createReply.useMutation({
    onMutate: () => {
      utils.tweet.getTweetReplies.cancel();
      const optimisticUpdate = utils.tweet.getTweetReplies.getData({
        tweetId: tweet.id,
      });

      if (optimisticUpdate) {
        utils.tweet.getTweetReplies.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.tweet.getTweetReplies.invalidate();
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setModal(false);
    let mediaUrl = null;
    let hashtags = text
      .split(" ")
      .filter((word) => word.startsWith("#"))
      .map((word) => word.slice(1));

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

    await toast
      .promise(createReply({ text, mediaUrl, tweetId: tweet.id, hashtags }), {
        loading: "Replying tweet",
        success: "Tweet replied",
        error: (err) => `Oops something went wrong ${err}`,
      })
      .then((data) => {
        if (tweet.userId !== session?.user?.id) {
          sendNotification({
            text: `${session?.user?.name} just replied on your tweet`,
            redirectUrl: `/status/${data.id}`,
            recipientId: tweet.userId,
          });
        } else {
          return data;
        }
      });

    // textRef!.current!.value = "";
    setText("");
    setSelectedFile(undefined);

    await router.push(`/status/${tweet.id}`);
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

  const onEmojiSelect = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setText(text + emoji);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="flex items-start gap-x-4">
        <Avatar image={session?.user?.image || ""} width={40} height={40} />
        <textarea
          ref={textRef}
          cols={50}
          value={text || ""}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 resize-none bg-transparent text-base outline-none md:text-xl"
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
      <div className="mt-4 flex items-center justify-between gap-x-2  ">
        <MediaTools onSelectFile={onSelectFile} onEmojiSelect={onEmojiSelect} />
        <div className="flex-[0.5]">
          <Button text="Reply" />
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
