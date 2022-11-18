import { Tweet,User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { ITweet } from '../../interface'
import moment from 'moment'
import ReactTimeAgo from 'react-time-ago'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { AiOutlineComment, AiOutlineHeart, AiOutlineRetweet, AiOutlineShareAlt } from 'react-icons/ai'
import { useReplyModal, useTweetId } from '../../lib/zustand'
import Avatar from './Avatar'
interface IProps {
  tweet:Tweet
}

const TweetComponent = ({ tweet }:IProps) => {
  const now = new Date();
  const msBetweenDates =tweet?.createdAt?.getTime() - now.getTime();

// 👇️ convert ms to hours                  min  sec   ms
const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

console.log(hoursBetweenDates);

const { modal,setModal } = useReplyModal();
const { setTweetId } = useTweetId()
 
  return (
    <div className='p-4 flex items-start gap-x-4'>
      <Avatar image={tweet.user.image || ""} />
        <div className='flex flex-col  w-full'>
          <div className='flex items-center gap-x-2'>
            <h1 className='text-lg font-semibold'>{tweet?.user.name}</h1>
            <p className='text-gray-400 text-sm'>
              {hoursBetweenDates > 24 ? <span>{moment(tweet.createdAt as Date).format("ll")}</span> : <ReactTimeAgo date={tweet.createdAt as Date} locale="en-US" /> }
              
            </p>
          </div>
          <p>{tweet?.text}</p>

          {tweet?.image ? (
            <div className='w-3/4  h-96 relative'>
              {tweet?.image.includes("video") ? (
                <video  controls className='relative w-full h-full rounded-2xl'>
                  <source src={tweet?.image} type="video/mp4"></source>
                </video>

              ):(
                <Image objectFit='cover' alt={tweet?.text ?? "" } src={tweet?.image} className='rounded-2xl' layout="fill"  /> 
              
              )}

            </div>
          ): null}
          <div className='flex  items-center justify-between'>
            <div onClick={()=>{
              setModal(true);
              setTweetId(tweet.id)
              
            }} className='cursor-pointer hover:bg-blue-50 group  rounded-full p-2'>
              <AiOutlineComment className='group-hover:text-primary'  />

            </div>
            <div className='cursor-pointer hover:bg-blue-50 group  rounded-full p-2'>
              <AiOutlineHeart className='group-hover:text-primary'  />

            </div>
            <div className='cursor-pointer hover:bg-blue-50 group  rounded-full p-2'>
              <AiOutlineRetweet className='group-hover:text-primary'  />

            </div>
            <div className='cursor-pointer hover:bg-blue-50 group  rounded-full p-2'>
              <AiOutlineShareAlt className='group-hover:text-primary'  />

            </div>
            <div className='cursor-pointer hover:bg-blue-50 group  rounded-full p-2'>
              <IoAnalyticsOutline className='group-hover:text-primary'  />

            </div>
          </div>
        </div>
    </div>
  )
}

export default TweetComponent