"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { supabase } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loadUserData } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if there's an active session
      await loadUserData()
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserData()
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/signin')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUserData, router])

  // Handle protected routes
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith('/auth/')
      
      if (!user && !isAuthRoute) {
        router.push('/auth/signin')
      } else if (user && isAuthRoute) {
        router.push('/dashboard')
      }
    }
  }, [user, isLoading, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
