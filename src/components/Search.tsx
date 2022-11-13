import React from 'react'
import { BiSearch } from 'react-icons/bi'

const Search = () => {
  return (
    <div className='rounded-full text-gray-500 bg-gray-100 px-4 py-2 flex items-center gap-x-4'>
        <BiSearch />
        <input type="text" className='bg-transparent outline-none' placeholder='Search Twitter' />
    </div>
  )
}

export default Search