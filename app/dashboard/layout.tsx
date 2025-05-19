'use client'

import { AppHeader } from '@/components/layout/app-header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  )
}
