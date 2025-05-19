'use client'

import Link from 'next/link'

export default function FinalTestPage() {
  return (
    <div style={{
      backgroundColor: 'blue',
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
        FINAL TEST PAGE - V9
      </h1>
      
      <div style={{
        backgroundColor: 'orange',
        color: 'black',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '20px'
      }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          If you can see this page with a BLUE background and ORANGE box, the deployment is working!
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Version: 9 - Final Test
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
          color: 'blue',
          padding: '15px 30px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          display: 'inline-block'
        }}>
          Go to Home
        </Link>
        
        <Link href="/dashboard" style={{
          backgroundColor: 'white',
          color: 'blue',
          padding: '15px 30px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          display: 'inline-block'
        }}>
          Go to Dashboard
        </Link>
      </div>
      
      <div style={{
        backgroundColor: 'navy',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Debug Information</h2>
        <p>This is the final test page created to verify deployment.</p>
        <p>If you can see this page but not the other pages, there might be a caching issue with Vercel.</p>
        <p>Try visiting this URL directly: /final-test-v9</p>
      </div>
    </div>
  );
}
