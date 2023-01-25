import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { useHandleModal } from "../../lib/zustand";
import { trpc } from "../utils/trpc";
import Backdrop from "./Backdrop";

const HandleModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = useHandleModal();
  const [handleExist,setHandleExist] = useState(false)
  const { data: user } = trpc.user.getUser.useQuery();
  console.log(user);

  const utils = trpc.useContext()
  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const [value, setValue] = useState<string>("");

  const debouncedValue = useDebounce<string>(value, 500);
  const { data: userHandle } = trpc.user.getUserByHandle.useQuery({
    handle:debouncedValue,
  });


  const { mutateAsync:editHandle } = trpc.user.editUserHandle.useMutation({
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

  console.log(debouncedValue);
  useEffect(() => {
    // Do fetch here...
    // refetch();
    if(userHandle) {
      setHandleExist(true)
    } else {
      setHandleExist(true)

    }

  }, [debouncedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const { data: session } = useSession();

  const handleSubmit =async()=>{
    setModal(false)

    await toast.promise(editHandle({ handle:value }),{
      loading:"Changing handle",
      success:"Handle succesfully changed",
      error:(err)=>`Oops something went wrong `+ err
    });
  }

  return (
    <Backdrop>
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
        <form className="form-control w-full " onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit()
        }}>
          <label className="label">
            <span className="label-text mx-auto text-center text-base font-semibold sm:text-lg md:text-xl">
              You can edit your handle name here
            </span>
          </label>
          {userHandle ? (
            <label className="label">
              <span className="text-red-600">Handle name already taken</span>
            </label>
          ) : null}

          <input
            type="text"
            placeholder={`e.g ${session?.user?.name
              ?.replace(/\s/g, "")
              .toLowerCase()}`}
            className={` ${
              userHandle ? "border-red-600" : null
            } input-bordered input w-full `}
            onChange={handleChange}
            defaultValue={user?.handle || ""}
          />
        </form>
        <p className=" text-xs text-gray-500 sm:text-base md:text-lg">
          Having your own unique handle name makes it easier for people to
          interact with you
        </p>
      </div>
    </Backdrop>
  );
};

export default HandleModal;
