'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)
  const timestamp = new Date().toISOString()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ 
      padding: '50px', 
      background: 'red', 
      color: 'white', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        TEST PAGE - COMPLETELY NEW
      </h1>
      
      <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
        This is a completely new page created to test Vercel deployment
      </p>
      
      <div style={{ 
        background: 'yellow', 
        color: 'black', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px',
        maxWidth: '600px'
      }}>
        <p><strong>Timestamp (server-side):</strong> {timestamp}</p>
        <p><strong>Mounted (client-side):</strong> {mounted ? 'Yes' : 'No'}</p>
        <p><strong>Deployment Version:</strong> V4 - Red Background</p>
      </div>
      
      <Link href="/dashboard" style={{ 
        background: 'white', 
        color: 'red', 
        padding: '10px 20px', 
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        Go to Dashboard
      </Link>
    </div>
  )
}
