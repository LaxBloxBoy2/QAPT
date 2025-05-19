'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuth } from '@/components/providers/auth-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router, mounted])

  // Don't render anything until we've checked auth status
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-[#0a3622] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If we have a user, render the dashboard with sidebar
  if (user) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - fixed position, always visible */}
        <Sidebar />

        {/* Main content - adjusted margin to account for sidebar width */}
        <main className="flex-1 ml-[70px] lg:ml-[250px] p-6 md:p-8">
          {children}
        </main>
      </div>
    )
  }

  // This should never render because of the redirect, but just in case
  return null
}
