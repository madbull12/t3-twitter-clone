import { useRouter } from 'next/router'
import React from 'react'
import Body from '../components/Body'
import Loader from '../components/Loader'
import SearchHeader from '../components/SearchHeader'
import TweetComponent from '../components/TweetComponent'
import { trpc } from '../utils/trpc'

const SearchPage = () => {
    const router = useRouter();
    const term = router.query.q as string;
    const { data:searchResults,isLoading } = trpc.tweet.searchTweets.useQuery({ term });
    console.log(searchResults)
  return (
    <Body>
        <SearchHeader />
        {
            isLoading ? (
                <Loader />
            ) : null
        }
        {searchResults?.map((result)=>(
            <TweetComponent tweet={result} />
        ))}
    </Body>
  )
}

export default SearchPage