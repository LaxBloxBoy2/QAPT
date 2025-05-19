'use client'

import SidebarLayout from './sidebar-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is a completely new implementation
  return <SidebarLayout>{children}</SidebarLayout>
}
