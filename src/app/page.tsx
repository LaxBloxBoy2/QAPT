export default function Home() {
  return (
    <div style={{
      backgroundColor: 'purple',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '4rem',
        marginBottom: '20px'
      }}>
        QAPT HOME PAGE
      </h1>

      <div style={{
        backgroundColor: 'yellow',
        color: 'black',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '20px'
      }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          If you can see this page with a PURPLE background and YELLOW box, the deployment is working!
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Version: 7 - Home Page Override
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Timestamp: {new Date().toISOString()}
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <a href="/dashboard" style={{
          backgroundColor: 'white',
          color: 'purple',
          padding: '15px 30px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          Go to Dashboard
        </a>

        <a href="/emergency" style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          Emergency Test Page
        </a>
      </div>
    </div>
  );
}
