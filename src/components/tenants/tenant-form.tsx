'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tenant, Property } from '@/types/database.types'
import { createTenant, updateTenant } from '@/app/actions/tenants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TenantFormProps {
  tenant?: Tenant
  properties?: Property[]
  propertyId?: string
  isEditing?: boolean
}

export function TenantForm({ tenant, properties = [], propertyId, isEditing = false }: TenantFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || tenant?.property_id || '')

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
      
      if (isEditing && tenant) {
        await updateTenant(tenant.id, formData)
      } else {
        await createTenant(formData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</CardTitle>
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
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={tenant?.full_name || ''}
              placeholder="Tenant's full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={tenant?.email || ''}
              placeholder="Tenant's email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={tenant?.phone || ''}
              placeholder="Tenant's phone number"
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Tenant' : 'Add Tenant'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
