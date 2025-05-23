'use client'

import Link from 'next/link'

export default function EmergencyPage() {
  return (
    <div style={{
      backgroundColor: 'red',
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
        EMERGENCY TEST PAGE
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
          If you can see this page with a RED background and YELLOW box, the deployment is working!
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Version: 8 - Emergency Test (Fixed Links)
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
        <Link href="/" style={{
          backgroundColor: 'white',
          color: 'red',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          Go to Home
        </Link>

        <Link href="/dashboard" style={{
          backgroundColor: 'white',
          color: 'red',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          Go to Dashboard
        </Link>
      </div>

      <div style={{
        backgroundColor: 'black',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Debug Information</h2>
        <p>This is a completely new page created as a last resort to test deployment.</p>
        <p>It uses only inline styles and Next.js Link components.</p>
        <p>If you can see this page but not the sidebar layout, there might be an issue with the component structure.</p>
      </div>
    </div>
  );
}
