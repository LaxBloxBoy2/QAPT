'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSignature } from 'lucide-react'

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Leases</h1>
          <p className="text-gray-500 mt-1">Manage your property leases</p>
        </div>
        <Button className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
          <FileSignature className="h-5 w-5 mr-2" />
          Add Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>No leases yet</CardTitle>
            <CardDescription>
              Add your first lease to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
              <FileSignature className="h-5 w-5 mr-2" />
              Add Your First Lease
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
