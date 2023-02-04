import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import usePolling from "../../hooks/usePolling";
import { useChoices, useDisableTweet, useOpenPolling } from "../../lib/zustand";

const PollingSection = () => {
  const { choices, handleChange } = usePolling();

  const { setIsOpen } = useOpenPolling();
  const { incChoices } = useChoices();

  return (
    <div className="space-y-4 rounded-xl border border-base-300 p-4">
      {choices.map((choice, i: number) => (
        // <input onChange={(e)=>handleChange(e,i)}  placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
        // {(i === choices.length-1) ? (
        //   <IoMdAdd onClick={incChoices} className='text-xl cursor-pointer hover:text-primary ' />

        // ) : null}
        <div className="flex items-center gap-x-2">
          <input
            onChange={(e) => handleChange(e, i)}
            placeholder={`Choice ${i + 1}`}
            className="input-primary  input w-full max-w-xs"
          />
          {i === choices.length - 1 ? (
            <IoMdAdd
              onClick={incChoices}
              className="cursor-pointer text-xl hover:text-primary "
            />
          ) : null}
        </div>
      ))}
      {/* {choices.map((choice,i)=>(
            <div className='flex items-center gap-x-2'>
                <input onChange={(e)=>handleChange(e,i)} placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
                <IoMdAdd onClick={incChoices} className='text-xl cursor-pointer hover:text-primary ' />
            </div>
            
        )).slice(-1)} */}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="w-full rounded-xl p-4 text-center text-red-600  transition-all duration-100 ease-linear "
      >
        Close polling
      </button>
      {/* <input placeholder="Choice 2" className='input input-primary w-full max-w-xs' /> */}
    </div>
  );
};

export default PollingSection;
