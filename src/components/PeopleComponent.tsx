import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import Button from './Button'

interface IProps {
    user:User
}
const PeopleComponent = ({ user }:IProps) => {
  return (
    <div className='p-2 flex items-start justify-between gap-x-4'>
        <Image alt={user.name || ""} src={user.image || ""} width={40} height={40} className="rounded-full" />
        <div>
            <h1 className='font-semibold text-lg'>{user.name}</h1>
        </div>
        <div className='ml-auto'>
         <Button text={"Follow"}  />

        </div>
    </div>
  )
}

export default PeopleComponent