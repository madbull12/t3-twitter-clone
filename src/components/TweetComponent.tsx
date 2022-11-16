import { Tweet,User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { ITweet } from '../../interface'

interface IProps {
  tweet:Tweet
}

const TweetComponent = ({ tweet }:IProps) => {
  return (
    <div className='p-4 flex items-center gap-x-2'>
        <Image src={tweet.user.image || ""} alt="profile-image" width={40} height={40} className="rounded-full" />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>{tweet.user.name}</h1>
        </div>
    </div>
  )
}

export default TweetComponent