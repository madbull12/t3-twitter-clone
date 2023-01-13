import { useSession } from 'next-auth/react'
import React from 'react'
import Body from '../../../components/Body'
import NavFeed from '../../../components/NavFeed'

const FollowerPage = () => {
    const { data:session } = useSession();
  return (
    <Body>
        <NavFeed title={session?.user?.name as string}>
            fdfdfd
        </NavFeed>
    </Body>
  )
}

export default FollowerPage