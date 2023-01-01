import { useRouter } from 'next/router'
import React from 'react'
import Avatar from '../../components/Avatar'
import Body from '../../components/Body'
import NavFeed from '../../components/NavFeed'
import { trpc } from '../../utils/trpc'

const ProfilePage = () => {
  const router = useRouter()

  const { username,userId } = router.query

  const { data:userTweets } = trpc.tweet.getUserTweets.useQuery({ userId: userId as string });

  return (
    <Body>
      <NavFeed tweets={userTweets?.length} title={username as string} />
      <div className='w-full relative h-48'>
        <div className='w-full h-full bg-gray-200'></div>

      </div>
      <div className='flex items-start justify-between'>
        <Avatar image={} width={100} height={100}  />
      </div>


    </Body>
  )
}

export default ProfilePage