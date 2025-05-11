"use client"

import { OrgSwitcher } from "@/components/org-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatarMenu } from "@/components/user-avatar-menu"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <OrgSwitcher />
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <UserAvatarMenu />
        </div>
      </div>
    </header>
  )
}
