'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSignature } from 'lucide-react'

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leases</h1>
          <p className="text-muted-foreground mt-1">Manage your property leases</p>
        </div>
        <Button className="rounded-lg">
          <FileSignature className="h-5 w-5 mr-2" />
          Add Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>No leases yet</CardTitle>
            <CardDescription>
              Add your first lease to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="rounded-lg">
              <FileSignature className="h-5 w-5 mr-2" />
              Add Your First Lease
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
