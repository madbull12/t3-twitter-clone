import React from 'react'

interface IProps {
    text:string
}
const Button = ({ text }:IProps) => {
  return (
    <button className='rounded-full px-4 py-2  w-full text-white font-semibold bg-primary'>
        {text}
    </button>
  )
}

export default Button