import React from 'react'
import Body from '../../components/Body'
import NavFeed from '../../components/NavFeed'
import { trpc } from '../../utils/trpc'
import { MdPostAdd } from 'react-icons/md'
const ListPage = () => {
  const { data:user } = trpc.user.getUser.useQuery()
  return (
    <Body>
        <NavFeed title={"Lists"} subtitle={`@${user?.handle}`}>
          <div className='absolute top-6 right-4'>

            <MdPostAdd className='text-2xl cursor-pointer ' />
          </div>
        </NavFeed>
    </Body>
  )
}

export default ListPage