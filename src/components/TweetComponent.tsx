import { Tweet,User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { ITweet } from '../../interface'
import moment from 'moment'
import ReactTimeAgo from 'react-time-ago'
interface IProps {
  tweet:Tweet
}

const TweetComponent = ({ tweet }:IProps) => {
  let oneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
  let dateCreated = tweet.createdAt.getTime()
  const moreThan24hr = oneDay < dateCreated;
  console.log(moreThan24hr);

  return (
    <div className='p-4 flex items-start gap-x-2'>
        <Image src={tweet.user.image || ""} alt="profile-image" width={50} height={50} className="rounded-full" />
        <div className='flex flex-col gap-y-3 w-full'>
          <div className='flex items-center gap-x-2'>
            <h1 className='text-lg font-semibold'>{tweet.user.name}</h1>
            <p className='text-gray-400 text-sm'>
              {moreThan24hr ? <span>{moment(tweet.createdAt).format("ll")}</span> : <ReactTimeAgo date={tweet.createdAt} locale="en-US" /> }
              
            </p>
          </div>
          <p>{tweet.text}</p>

          {tweet.image ? (
            <div className='w-3/4  h-96 relative'>
              {tweet.image.includes("video") ? (
                <video  controls className='relative w-full h-full rounded-2xl'>
                  <source src={tweet.image} type="video/mp4"></source>
                </video>

              ):(
                <Image objectFit='cover' alt={tweet?.text ?? "" } src={tweet.image} className='rounded-2xl' layout="fill"  /> 
              
              )}

            </div>
          ): null}
        </div>
    </div>
  )
}

export default TweetComponent