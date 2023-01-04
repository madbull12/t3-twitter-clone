import React from 'react'
import useBookmark from '../../hooks/useBookmark'
import Body from '../components/Body'
import NavFeed from '../components/NavFeed'
import TweetComponent from '../components/TweetComponent'

const BookmarkPage = () => {
  const { bookmarks } = useBookmark();
  return (
    <Body>
        <NavFeed title='Bookmarks' />
        {bookmarks?.map((bookmark)=>(
          <TweetComponent tweet={bookmark.tweet} />
        ))}
    </Body>
  )
}

export default BookmarkPage