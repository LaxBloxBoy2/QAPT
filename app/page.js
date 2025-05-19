export default function Home() {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#0a3622'
      }}>
        QAPT Property Management System
      </h1>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <a 
          href="/dashboard" 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0a3622',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Go to Dashboard
        </a>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Property Management</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>Manage all your properties in one place</p>
        </div>
        
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Tenant Management</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>Keep track of all your tenants</p>
        </div>
        
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Payment Tracking</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>Monitor rent payments and expenses</p>
        </div>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666' }}>Version 11 - Basic JavaScript Version</p>
      </div>
    </div>
  );
}
