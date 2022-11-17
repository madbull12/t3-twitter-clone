import { User } from '@prisma/client'
import React from 'react'

interface IProps {
    user:User
}
const PeopleComponent = ({ user }:IProps) => {
  return (
    <div>
        <h1>{user.name}</h1>
    </div>
  )
}

export default PeopleComponent