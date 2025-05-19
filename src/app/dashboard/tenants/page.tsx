'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-muted-foreground mt-1">Manage your property tenants</p>
        </div>
        <Button className="rounded-lg">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>No tenants yet</CardTitle>
            <CardDescription>
              Add your first tenant to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="rounded-lg">
              <UserPlus className="h-5 w-5 mr-2" />
              Add Your First Tenant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
