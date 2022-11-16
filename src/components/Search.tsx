import { useRouter } from 'next/router';
import React,{ useState } from 'react'
import { BiSearch } from 'react-icons/bi'

const Search = () => {
  const[term,setTerm] = useState("");
  const router = useRouter();
  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault()
    router.push(`/search?q=${term}`)
  }
  return (
    <form onSubmit={handleSubmit} className='rounded-full text-gray-500 bg-gray-100 px-4 py-2 flex items-center gap-x-4'>
        <BiSearch />
        <input onChange={(e)=>setTerm(e.target.value)} type="text" className='bg-transparent outline-none' placeholder='Search Twitter' />
    </form>
  )
}

export default Search