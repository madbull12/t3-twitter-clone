import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { useHandleModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Backdrop from "./Backdrop";
import Modal from "./Modal";

interface Error {
  isError: boolean;
  message: string;
}

const HandleModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = useHandleModal();
  const { data:session } = useSession()
  const [handleExist, setHandleExist] = useState(false);
  const { data: user } = trpc.user.getUser.useQuery({
    userId:session?.user?.id as string
  });

  const utils = trpc.useContext();
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const [value, setValue] = useState<string>("");

  const debouncedValue = useDebounce<string>(value, 500);
  const { data: userHandle } = trpc.user.getUserByHandle.useQuery({
    handle: debouncedValue,
  });

  const { mutateAsync: editHandle } = trpc.user.editUserHandle.useMutation({
    onMutate: () => {
      utils.user.getUser.cancel();
      const optimisticUpdate = utils.user.getUser.getData();
      if (optimisticUpdate) {
        utils.user.getUser.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.user.getUser.invalidate();
    },
  });
  const [handleError, setHandleError] = useState<Error>({
    isError: false,
    message: "",
  });
  let regexHandle = /^[a-zA-Z0-9_]+$/;

  useEffect(() => {
    // Do fetch here...
    // refetch();

    if (!regexHandle.test(debouncedValue)) {
      setHandleError({
        isError: true,
        message: "Your handle can only contain letters, numbers and '_'",
      });
    } else if (debouncedValue.length <= 4) {
      setHandleError({
        isError: true,
        message: "Your handle must be longer than 4 characters.",
      });
    } else if (userHandle) {
      setHandleError({
        isError: true,
        message: "That handle has been taken. Please choose another.",
      });
    } else {
      setHandleError({ isError: false, message: "" });

    }

    // if (regexHandle.test(debouncedValue)) {
    //   setHandleError({ isError: false, message: "" });
    //   console.log(handleError)
    // } else {
    //   setHandleError({
    //     isError: true,
    //     message: "Your handle can only contain letters, numbers and '_'",
    //   });
    // }
    // if (debouncedValue.length < 4) {
    //   setHandleError({
    //     isError: true,
    //     message: "Your handle must be longer than 4 characters.",
    //   });
    // } else {
    //   setHandleError({ isError: false, message: "" });
    // }

    // if (!userHandle) {
    //   setHandleError({ isError: false, message: "" });
    // } else {
    //   setHandleError({
    //     isError: true,
    //     message: "That handle has been taken. Please choose another.",
    //   });
    // }
  }, [debouncedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };


  const handleSubmit = async () => {
    setModal(false);

    if (handleError.isError) {
      toast.error(handleError.message);
    } else {
      await toast.promise(editHandle({ handle: value }), {
        loading: "Changing handle",
        success: "Handle succesfully changed",
        error: (err) => `Oops something went wrong ` + err,
      });
    }
  };

  return (
    <Modal>
      <div
        ref={modalRef}
        className="mx-auto h-[500px] w-3/4 space-y-3 overflow-y-scroll rounded-2xl  bg-base-100 p-4 sm:w-1/2"
      >
        <div className="flex items-center gap-x-8 text-xl font-semibold">
          <IoMdClose
            className="cursor-pointer text-xl"
            onClick={() => setModal(false)}
          />
        </div>
        <form
          className="form-control w-full "
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="label">
            <span className="label-text mx-auto text-center text-base font-semibold sm:text-lg md:text-xl">
              You can edit your handle name here
            </span>
          </label>
          {handleError.isError ? (
            <label className="label">
              <span className="text-red-400 text-xs  ">{handleError.message}</span>
            </label>
          ) : null}

          <input
            type="text"
            placeholder={`e.g ${session?.user?.name
              ?.replace(/\s/g, "")
              .toLowerCase()}`}
            className={` ${
              handleError.isError ? "input-error " : null
            } input-bordered input-primary input w-full`}
            onChange={handleChange}
            defaultValue={user?.handle || ""}
          />
        </form>
        <p className=" text-xs text-gray-500 sm:text-base md:text-lg">
          Having your own unique handle name makes it easier for people to
          interact with you
        </p>
      </div>
    </Modal>
  );
};

export default HandleModal;
