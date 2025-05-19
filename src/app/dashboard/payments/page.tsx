'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500 mt-1">Track and manage your property payments</p>
        </div>
        <Button className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
          <DollarSign className="h-5 w-5 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>No payments yet</CardTitle>
            <CardDescription>
              Record your first payment to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
              <DollarSign className="h-5 w-5 mr-2" />
              Record Your First Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
