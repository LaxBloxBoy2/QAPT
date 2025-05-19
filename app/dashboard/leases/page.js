export default function LeasesPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '20px',
        color: '#0a3622'
      }}>
        Leases
      </h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#666' }}>Manage your property leases</p>
        
        <button style={{ 
          padding: '8px 16px', 
          backgroundColor: '#0a3622', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add New Lease
        </button>
      </div>
      
      <div style={{ 
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          padding: '15px 20px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
          fontWeight: 'bold'
        }}>
          Active Leases
        </div>
        
        <div style={{ padding: '30px 20px', textAlign: 'center', color: '#666' }}>
          No active leases found
        </div>
      </div>
    </div>
  );
}
