'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Properties', href: '/dashboard/properties' },
    { name: 'Tenants', href: '/dashboard/tenants' },
    { name: 'Leases', href: '/dashboard/leases' },
    { name: 'Payments', href: '/dashboard/payments' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">QAPT</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-gray-200 dark:bg-gray-800 font-medium'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
