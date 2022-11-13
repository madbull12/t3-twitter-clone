import React from 'react'

interface IProps {
    text:string
}
const Button = ({ text }:IProps) => {
  return (
    <button className='rounded-full px-y py-2 mt-4 w-full text-white font-semibold bg-primary'>
        {text}
    </button>
  )
}

export default Button