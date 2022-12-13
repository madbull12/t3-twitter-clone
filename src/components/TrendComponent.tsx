import { Hashtag, Prisma } from '@prisma/client'
import React from 'react'

type HashtagWithTweet = Prisma.HashtagGetPayload<{
    include:{
        tweets:true
    }
}>
const TrendComponent = ({ hashtag }: { hashtag:HashtagWithTweet }) => {
  return (
    <div className='p-2 space-y-1 hover:bg-gray-50 cursor-pointer'>
        <p className='text-xs md:text-base text-gray-500'>Trending</p>
        <p className='font-semibold text-lg'>{hashtag.name}</p>
        <p className='text-gray-500'>{hashtag.tweets.length} Tweets</p>
    </div>
  )
}

export default TrendComponent