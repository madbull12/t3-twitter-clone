import Link from 'next/link'
import React from 'react'
import { BsTwitter } from 'react-icons/bs'
import { AiFillHome,AiFillBell } from 'react-icons/ai'
import { RiHashtag } from 'react-icons/ri'
import { v4 } from 'uuid'
const links = [{
  name:"Home",
  icon:<AiFillHome />
},{
  name:"Explore",
  icon:<RiHashtag />
},{
  name:"Notifications",
  icon:<AiFillBell />
}]
const Sidebar = () => { 
  return (
    <div className='py-3  pl-16 w-80 pr-8 min-h-screen  fixed left-0 top-0'>
      <div className='w-12 mb-2 hover:bg-blue-100 cursor-pointer transition-all duration-200  ease-in-out grid place-items-center rounded-full  h-12'>
        <BsTwitter className='text-3xl text-primary'/>

      </div>
      <ul>
        {links.map((link)=>(
          <li key={v4()} className='rounded-full px-4 py-2  hover:bg-gray-100  transition-all duration-200  ease-in-out'>
            <Link href="/">
              <span className='flex items-center gap-x-4 text-2xl'>
                {link.icon}
                {link.name}
              </span>
            </Link>
        </li>
        ))}
        
      </ul>
      <button className='rounded-full px-y py-2 mt-4 w-full text-white font-semibold bg-primary'>
        Tweet 
      </button>
    </div>
  )
}

export default Sidebar