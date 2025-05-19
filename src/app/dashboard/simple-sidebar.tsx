'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SimpleSidebar({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Properties', href: '/dashboard/properties' },
    { name: 'Tenants', href: '/dashboard/tenants' },
    { name: 'Leases', href: '/dashboard/leases' },
    { name: 'Payments', href: '/dashboard/payments' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - fixed position, always visible */}
      <div style={{ 
        width: '250px', 
        backgroundColor: 'black', 
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        padding: '20px',
        boxSizing: 'border-box',
        borderRight: '1px solid #333'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <Link href="/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            <span style={{ marginRight: '10px' }}>🏢</span>
            <span>QAPT</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ 
                  display: 'block',
                  padding: '10px 15px',
                  marginBottom: '5px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa',
                  backgroundColor: isActive ? '#0a3622' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content - adjusted margin to account for sidebar width */}
      <div style={{ 
        marginLeft: '250px', 
        padding: '20px',
        width: 'calc(100% - 250px)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
