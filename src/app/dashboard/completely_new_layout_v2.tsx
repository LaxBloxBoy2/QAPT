'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  LogOut,
  Bell,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CompletelyNewLayoutV2({
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
    <div className="min-h-screen flex">
      {/* Sidebar - sticky, vertical, left-aligned */}
      <aside className="w-64 shrink-0 h-screen sticky top-0 border-r bg-red-900 text-white">
        {/* Logo at the top */}
        <div className="p-6 border-b border-red-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-yellow-500" />
            <span className="font-bold text-xl">QAPT V2</span>
          </Link>
        </div>
        
        {/* Navigation links */}
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
                    ? "bg-yellow-900 text-white font-medium border-l-4 border-yellow-500" 
                    : "text-gray-300 hover:bg-red-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Header with user avatar and notification bell */}
        <header className="h-16 px-6 border-b bg-white flex items-center justify-between">
          <div className="text-xl font-bold text-red-600">COMPLETELY NEW LAYOUT V2</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                  <Avatar>
                    <AvatarFallback className="bg-red-600 text-white">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content with consistent padding */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
