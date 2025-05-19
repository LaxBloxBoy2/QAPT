'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and manage your property payments</p>
        </div>
        <Button className="rounded-lg">
          <DollarSign className="h-5 w-5 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>No payments yet</CardTitle>
            <CardDescription>
              Record your first payment to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="rounded-lg">
              <DollarSign className="h-5 w-5 mr-2" />
              Record Your First Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
