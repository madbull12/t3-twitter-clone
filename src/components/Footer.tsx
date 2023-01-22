import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react'
import { useMediaQuery } from 'usehooks-ts'

const Footer = () => {
  const phone = useMediaQuery("(min-width:768px)");
  const router = useRouter()
  return (
    <div className='fixed bottom-0 right-0 left-0 z-[99999] text-center bg-primary text-white p-4'>
      {phone ? (
        <h1 className='text-2xl font-bold'>Sign in to see what's happening</h1>

      ):(
        <button onClick={()=>router.push("/auth/signin")} className="border border-white rounded-full px-8 py-1 font-semibold">Sign in</button>
      )
      }
    </div>
  )
}

export default Footer