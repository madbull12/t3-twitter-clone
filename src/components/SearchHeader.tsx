import { useRouter } from 'next/router'
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import Search from './Search'

const SearchHeader = () => {
    const router = useRouter()
  return (
    <div>
        <div className='flex items-center justify-between'>
            <BsArrowLeft className='text-xl cursor-pointer' onClick={()=>router.back()} />
            <div className='flex-[0.5]'>
                <Search />
            </div>
           

        </div>
    </div>
  )
}

export default SearchHeader