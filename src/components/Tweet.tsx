import { Tweet } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { ITweet } from '../../interface'

interface IProps {
    tweet:Tweet
}
const Tweet = ({ tweet }:IProps) => {
  return (
    <div className='p-4'>
        <Image src={tweet.user.image} alt="profile-image" width={40} height={40} className="rounded-full" />
    </div>
  )
}

export default Tweet