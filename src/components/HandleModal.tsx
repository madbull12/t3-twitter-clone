import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { useHandleModal } from "../../lib/zustand";
import Backdrop from "./Backdrop";

const HandleModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = useHandleModal();

  useOnClickOutside(modalRef, () => {
    setModal(false);
  });
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);
  
  console.log(debouncedValue)
  useEffect(() => {
    // Do fetch here...
    // refetch();
    

  }, [debouncedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };


  const { data:session } = useSession();


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
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-base sm:text-lg md:text-xl text-center font-semibold mx-auto">You can edit your handle name here</span>
          </label>
          <input
            type="text"
            placeholder={`e.g ${session?.user?.name?.replace(/\s/g, '').toLowerCase()}`}
            className="input-bordered input w-full "
            onChange={handleChange}
          />
       
        </div>
        <p className=" text-xs sm:text-base md:text-lg text-gray-500">Having your own unique handle name makes it easier for people to interact with you</p>
      </div>
    </Backdrop>
  );
};

export default HandleModal;
