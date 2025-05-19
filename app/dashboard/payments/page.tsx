import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button asChild>
          <Link href="/dashboard/payments/new">Record Payment</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Empty state */}
        <Card>
          <CardHeader>
            <CardTitle>No payments yet</CardTitle>
            <CardDescription>
              Record your first payment to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/payments/new">Record Payment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
