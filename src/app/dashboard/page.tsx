'use client'

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', color: '#0a3622', marginBottom: '10px' }}>SIMPLIFIED DASHBOARD - VERSION 10</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>This is version 10 with BLACK sidebar and GREEN active links</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Properties</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Total properties managed</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Tenants</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Total active tenants</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Payments</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>This month's revenue</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>€0.00</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Recent Payments</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Latest payment activity</p>
          <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No recent payments</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Upcoming Leases</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Leases ending soon</p>
          <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No upcoming lease expirations</p>
        </div>
      </div>
    </div>
  )
}
