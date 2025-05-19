'use client'

import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-[70px] lg:ml-[250px] p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
