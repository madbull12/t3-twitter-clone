import Image from 'next/image'
import React from 'react'

interface IProps {
    image:string
}
const Avatar = ({ image }: IProps) => {
  return (
    <Image
        alt="profile-image"
        className="rounded-full"
        src={image}
        width={50}
        height={50}
  />
  )
}

export default Avatar