import React,{ useState,useEffect } from 'react'
import { IoMdAdd } from 'react-icons/io'
import usePolling from '../../hooks/usePolling';
import { useChoices, useDisableTweet, useOpenPolling } from '../../lib/zustand';


const PollingSection = () => {
  const { choices,handleChange } = usePolling();

  const { setIsOpen } = useOpenPolling();
  const { incChoices } = useChoices()

  return (
    
    <div className='p-4 rounded-xl border border-base-300 space-y-4'>
        {choices.map((choice,i)=>(
            <input onChange={(e)=>handleChange(e,i)}  placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
            
        )).slice(0,choices.length-1)}
        {choices.map((choice,i)=>(
            <div className='flex items-center gap-x-2'>
                <input onChange={(e)=>handleChange(e,i)} placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
                <IoMdAdd onClick={incChoices} className='text-xl cursor-pointer hover:text-primary ' />
            </div>
            
        )).slice(-1)}
        <button type="button" onClick={()=>setIsOpen(false)}  className='rounded-xl text-center transition-all duration-100 ease-linear  w-full p-4 text-red-600 '>Close polling</button>
        {/* <input placeholder="Choice 2" className='input input-primary w-full max-w-xs' /> */}
    </div>
  )
}

export default PollingSection