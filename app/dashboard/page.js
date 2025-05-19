export default function Dashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: 'black', 
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ 
          marginBottom: '30px', 
          fontSize: '24px', 
          fontWeight: 'bold' 
        }}>
          QAPT SIDEBAR
        </div>
        
        <nav>
          <div style={{ 
            padding: '10px', 
            marginBottom: '5px', 
            backgroundColor: '#0a3622',
            borderRadius: '4px'
          }}>
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
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              color: '#0a3622', 
              marginBottom: '10px' 
            }}>
              DASHBOARD - VERSION 11
            </h1>
            <p style={{ 
              color: '#666', 
              marginBottom: '20px' 
            }}>
              This is version 11 with BLACK sidebar and GREEN active links
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px' 
          }}>
            <div style={{ 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              backgroundColor: 'white'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '10px' 
              }}>
                Properties
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px' 
              }}>
                Total properties managed
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold' 
              }}>
                3
              </p>
            </div>

            <div style={{ 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              backgroundColor: 'white'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '10px' 
              }}>
                Tenants
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px' 
              }}>
                Total active tenants
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold' 
              }}>
                0
              </p>
            </div>

            <div style={{ 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              backgroundColor: 'white'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '10px' 
              }}>
                Payments
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px' 
              }}>
                This month's revenue
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold' 
              }}>
                €0.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
