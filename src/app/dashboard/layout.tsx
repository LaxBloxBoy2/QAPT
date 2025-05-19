'use client'

import NewDashboardLayout from './new-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NewDashboardLayout>{children}</NewDashboardLayout>
}
