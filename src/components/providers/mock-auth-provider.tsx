'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { mockUser } from '@/lib/mock-data'

type MockAuthContextType = {
  user: typeof mockUser | null
  isLoading: boolean
  signOut: () => void
}

const MockAuthContext = createContext<MockAuthContextType>({
  user: null,
  isLoading: true,
  signOut: () => {},
})

export const useMockAuth = () => useContext(MockAuthContext)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Simulate loading delay
    const timer = setTimeout(() => {
      setUser(mockUser)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [mounted])

  const signOut = () => {
    // In a real app, this would call an auth service
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    signOut,
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}
