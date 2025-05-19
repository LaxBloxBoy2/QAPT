'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Building,
  Users,
  FileText,
  CreditCard,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Building },
    { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
    { name: 'Leases', href: '/dashboard/leases', icon: FileText },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  ]

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
      collapsed ? "w-[70px]" : "w-[250px]",
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
    )}>
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center space-x-2 overflow-hidden">
          <Building className="h-7 w-7 text-[#0a3622] dark:text-white flex-shrink-0" />
          {!collapsed && <span className="font-bold text-xl whitespace-nowrap">QAPT</span>}
        </Link>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
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
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0a3622] dark:hover:text-white",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <Icon className={cn("flex-shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5 mr-3")} />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User section */}
      <div className={cn(
        "p-4 border-t border-gray-200 dark:border-gray-800",
        collapsed ? "flex justify-center" : "block"
      )}>
        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-9 w-9 border-2 border-[#0a3622]">
                  <AvatarFallback className="bg-[#0a3622] text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-[#0a3622]" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-[#0a3622]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4 text-[#0a3622]" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-9 w-9 mr-3 border-2 border-[#0a3622]">
                <AvatarFallback className="bg-[#0a3622] text-white">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="h-8 px-2 justify-start text-gray-500 hover:text-[#0a3622] hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-xs">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
