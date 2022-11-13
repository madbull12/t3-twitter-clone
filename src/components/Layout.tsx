import React, { FC } from 'react'
import Sidebar from './Sidebar'

interface IProps {
    children: React.ReactNode
}
const Layout = ({ children }:IProps) => {
  return (
    <div>
        <Sidebar />
        {children}
    </div>
  )
}

export default Layout