'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Building },
    { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
    { name: 'Leases', href: '/dashboard/leases', icon: FileText },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - fixed position, always visible */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-[#0a3622]" />
            <span className="font-bold text-xl">QAPT</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-md transition-colors",
                  isActive
                    ? "bg-[#0a3622]/10 text-[#0a3622] dark:text-white font-medium border-l-4 border-[#0a3622]"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0a3622]"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-[#0a3622] text-white flex items-center justify-center mr-3">
                <span className="text-sm font-bold">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">User</span>
                <button
                  className="flex items-center text-xs text-gray-500 hover:text-[#0a3622]"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - adjusted margin to account for sidebar width */}
      <main className="flex-1 ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
