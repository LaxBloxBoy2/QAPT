'use client'

import SimpleSidebar from './simple-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is a simple sidebar layout with inline styles
  return <SimpleSidebar>{children}</SimpleSidebar>
}
