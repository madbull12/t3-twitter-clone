import React,{ useState } from 'react'
import { IoMdAdd } from 'react-icons/io'

const PollingSection = () => {
    const [choices,setChoices] = useState([{
        choice:""
    },{
        choice:""
    }])
  return (
    <div className='p-4 rounded-xl border border-base-300 space-y-4'>
        {choices.map((choice,i)=>(
            <input placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
            
        )).slice(0,choices.length-1)}
        {choices.map((choice,i)=>(
            <div className='flex items-center gap-x-2'>
                <input placeholder={`Choice ${i+1}`} className='input  input-primary w-full max-w-xs' />
                <IoMdAdd onClick={()=>setChoices([...choices,{ choice:"" }])} className='text-xl cursor-pointer hover:text-primary ' />
            </div>
            
        )).slice(-1)}
        {/* <input placeholder="Choice 2" className='input input-primary w-full max-w-xs' /> */}
    </div>
  )
}

export default PollingSection