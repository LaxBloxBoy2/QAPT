"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Building2, 
  DoorOpen, 
  FileText, 
  Home, 
  Menu, 
  Settings, 
  Users, 
  Wallet, 
  X 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      href: "/properties",
      icon: Building2,
      label: "Properties",
    },
    {
      href: "/units",
      icon: Home,
      label: "Units",
    },
    {
      href: "/tenants",
      icon: Users,
      label: "Tenants",
    },
    {
      href: "/leases",
      icon: DoorOpen,
      label: "Leases",
    },
    {
      href: "/finances",
      icon: Wallet,
      label: "Finances",
    },
    {
      href: "/documents",
      icon: FileText,
      label: "Documents",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-10">
          <nav className="flex flex-col gap-4 p-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === route.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <nav
        className={cn(
          "hidden lg:flex flex-col gap-4 p-6 border-r h-screen sticky top-0",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="font-bold text-xl">QAPT Platform</div>
        </div>
        <Separator className="mb-4" />
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
