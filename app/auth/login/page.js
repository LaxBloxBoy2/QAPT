export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        padding: '20px', 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Login
        </h1>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            Email
          </label>
          <input 
            type="email" 
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            Password
          </label>
          <input 
            type="password" 
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
        </div>
        
        <button style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#0a3622', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Login
        </button>
        
        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          <a 
            href="/auth/signup" 
            style={{ 
              color: '#0a3622', 
              textDecoration: 'none' 
            }}
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
