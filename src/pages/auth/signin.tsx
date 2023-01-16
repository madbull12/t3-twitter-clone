import React from 'react'
import { BsTwitter } from 'react-icons/bs'

const SignInPage = () => {
  return (
    <div className='p-4 bg-base-100 mx-auto flex-col gap-y-4 shadow-xl flex items-center justify-center max-w-2xl text-neutral'>
        <BsTwitter className='text-3xl' />
        <h1 className='font-bold text-3xl'>Sign in to Twitter</h1>
    </div>
  )
}

export default SignInPage