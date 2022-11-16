import { Tweet,User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { ITweet } from '../../interface'

interface IProps {
  tweet:Tweet
}

const TweetComponent = ({ tweet }:IProps) => {
  return (
    <div className='p-4 flex items-start gap-x-2'>
        <Image src={tweet.user.image || ""} alt="profile-image" width={50} height={50} className="rounded-full" />
        <div className='flex flex-col w-full'>
          <h1 className='text-lg font-semibold'>{tweet.user.name}</h1>
          <p>{tweet.text}</p>

          {tweet.image ? (
            <div className='w-3/4  h-96 relative'>
              <Image objectFit='cover' alt={tweet?.text ?? "" } src={tweet.image} className='rounded-2xl' layout="fill"  /> 

            </div>
          ): null}
        </div>
    </div>
  )
}

export default TweetComponent