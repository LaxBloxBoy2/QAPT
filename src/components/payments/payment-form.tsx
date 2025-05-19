'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Payment, Lease } from '@/types/database.types'
import { createPayment, updatePayment } from '@/app/actions/payments'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaymentFormProps {
  payment?: Payment
  leases?: Lease[]
  leaseId?: string
  isEditing?: boolean
}

export function PaymentForm({ 
  payment, 
  leases = [], 
  leaseId, 
  isEditing = false 
}: PaymentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLeaseId, setSelectedLeaseId] = useState(leaseId || payment?.lease_id || '')
  const [selectedStatus, setSelectedStatus] = useState(payment?.status || 'pending')

  const paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add lease ID if not already in the form
      if (!formData.has('leaseId') && selectedLeaseId) {
        formData.append('leaseId', selectedLeaseId)
      }
      
      // Add status if not already in the form
      if (!formData.has('status') && selectedStatus) {
        formData.append('status', selectedStatus)
      }
      
      if (isEditing && payment) {
        await updatePayment(payment.id, formData)
      } else {
        await createPayment(formData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Payment' : 'Record New Payment'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {leases.length > 0 && !leaseId && (
            <div className="space-y-2">
              <Label htmlFor="leaseId">Lease</Label>
              <Select
                name="leaseId"
                value={selectedLeaseId}
                onValueChange={setSelectedLeaseId}
                required
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lease" />
                </SelectTrigger>
                <SelectContent>
                  {leases.map((lease) => (
                    <SelectItem key={lease.id} value={lease.id}>
                      {`Lease for ${lease.tenant_id} - $${lease.rent_amount}/month`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={payment?.amount || ''}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="datePaid">Payment Date</Label>
            <Input
              id="datePaid"
              name="datePaid"
              type="date"
              defaultValue={payment?.date_paid || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Payment Status</Label>
            <Select
              name="status"
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Payment' : 'Record Payment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
