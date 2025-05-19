'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lease, Property, Tenant } from '@/types/database.types'
import { createLease, updateLease } from '@/app/actions/leases'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LeaseFormProps {
  lease?: Lease
  properties?: Property[]
  tenants?: Tenant[]
  propertyId?: string
  isEditing?: boolean
}

export function LeaseForm({ 
  lease, 
  properties = [], 
  tenants = [], 
  propertyId, 
  isEditing = false 
}: LeaseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || lease?.property_id || '')
  const [selectedTenantId, setSelectedTenantId] = useState(lease?.tenant_id || '')

  // Filter tenants by selected property
  const filteredTenants = tenants.filter(tenant => 
    tenant.property_id === selectedPropertyId && !tenant.lease_id
  )

  // Add current tenant to the list if editing
  if (isEditing && lease) {
    const currentTenant = tenants.find(t => t.id === lease.tenant_id)
    if (currentTenant && !filteredTenants.includes(currentTenant)) {
      filteredTenants.push(currentTenant)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add property ID if not already in the form
      if (!formData.has('propertyId') && selectedPropertyId) {
        formData.append('propertyId', selectedPropertyId)
      }
      
      // Add tenant ID if not already in the form
      if (!formData.has('tenantId') && selectedTenantId) {
        formData.append('tenantId', selectedTenantId)
      }
      
      if (isEditing && lease) {
        await updateLease(lease.id, formData)
      } else {
        await createLease(formData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Lease' : 'Add New Lease'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {properties.length > 0 && !propertyId && (
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property</Label>
              <Select
                name="propertyId"
                value={selectedPropertyId}
                onValueChange={setSelectedPropertyId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant</Label>
            <Select
              name="tenantId"
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
              required
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                {filteredTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPropertyId && filteredTenants.length === 0 && (
              <p className="text-sm text-red-500">
                No available tenants for this property. Add a tenant first.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={lease?.start_date || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={lease?.end_date || ''}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rentAmount">Monthly Rent Amount</Label>
            <Input
              id="rentAmount"
              name="rentAmount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={lease?.rent_amount || ''}
              placeholder="0.00"
              required
            />
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
          <Button 
            type="submit" 
            disabled={isSubmitting || (filteredTenants.length === 0 && !isEditing)}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Lease' : 'Add Lease'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
