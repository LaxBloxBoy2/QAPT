'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 style={{ fontSize: '2rem', color: '#0a3622', marginBottom: '10px' }}>SIMPLE SIDEBAR - VERSION 6</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>This is version 6 with BLACK sidebar and GREEN active links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Total properties managed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Total active tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>This month's revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">€0.00</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-6">No recent payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leases</CardTitle>
            <CardDescription>Leases ending soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-6">No upcoming lease expirations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
