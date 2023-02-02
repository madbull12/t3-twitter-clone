import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import ProtectedRoute from './ProtectedRoute'

const authRoutes = ["/following",'/status/[statusId]','/[userId]/[username]','/[userId]/[username]/followers','/[userId]/[username]/following',"/bookmarks","/list/[userId]","/list/[userId]/[listId]"]

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const session = useSession()
  const router = useRouter()

  if (session.status === 'loading') return null

  return (
    <>
      {authRoutes.includes(router.pathname) ? (
        <ProtectedRoute>{children}</ProtectedRoute>
      ) : (
        children
      )}
    </>
  )
}

export default AuthWrapper