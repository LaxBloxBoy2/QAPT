'use client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: 'black',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>
          QAPT SIDEBAR
        </div>

        <nav>
          <div style={{ padding: '10px', marginBottom: '5px', backgroundColor: '#0a3622' }}>
            Dashboard
          </div>
          <div style={{ padding: '10px', marginBottom: '5px' }}>
            Properties
          </div>
          <div style={{ padding: '10px', marginBottom: '5px' }}>
            Tenants
          </div>
          <div style={{ padding: '10px', marginBottom: '5px' }}>
            Leases
          </div>
          <div style={{ padding: '10px', marginBottom: '5px' }}>
            Payments
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}
