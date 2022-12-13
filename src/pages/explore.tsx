import React from 'react'
import Body from '../components/Body'
import Search from '../components/Search'
import { trpc } from '../utils/trpc'

const ExplorePage = () => {
    const { data } = trpc.hashtag.getTopHashtags.useQuery();
    console.log(data)
  return (
    <Body>
        <Search />
        <div className='mt-4'>
            <h1 className='text-xl font-bold  '>Trends for you </h1>
        </div>
    </Body>
  )
}

export default ExplorePage