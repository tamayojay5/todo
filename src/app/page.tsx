'use client'

import { useAuth } from '@/contexts/AuthContext'
import AuthForm from '@/components/AuthForm/AuthForm'
import TodoList from '@/components/TodoList/TodoList'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return user ? <TodoList /> : <AuthForm />
}