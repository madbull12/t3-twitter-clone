import React, { FC } from 'react'
import Right from './Right'
import Sidebar from './Sidebar'

interface IProps {
    children: React.ReactNode
}
const Layout = ({ children }:IProps) => {
  return (
    <div>
        <Sidebar />
        {children}
        <Right />
    </div>
  )
}

export default Layout