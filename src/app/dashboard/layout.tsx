'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MockAuthProvider } from '@/components/providers/mock-auth-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-[#0a3622] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <MockAuthProvider>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - fixed position, always visible */}
        <Sidebar />

        {/* Main content - adjusted margin to account for sidebar width */}
        <main className="flex-1 ml-[70px] lg:ml-[250px] p-6 md:p-8">
          {children}
        </main>
      </div>
    </MockAuthProvider>
  )
}
