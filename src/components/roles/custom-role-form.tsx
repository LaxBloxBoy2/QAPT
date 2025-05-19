'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomRole } from '@/types/database.types'
import { createCustomRole, updateCustomRole } from '@/app/actions/roles'
import { Checkbox } from '@/components/ui/checkbox'

interface CustomRoleFormProps {
  role?: CustomRole
  isEditing?: boolean
}

export function CustomRoleForm({ role, isEditing = false }: CustomRoleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get permissions from role or default to empty object
  const permissions = role?.permissions || {}

  const permissionGroups = [
    {
      title: 'Properties',
      permissions: [
        { id: 'view_properties', label: 'View Properties' },
        { id: 'edit_properties', label: 'Edit Properties' },
      ],
    },
    {
      title: 'Tenants',
      permissions: [
        { id: 'view_tenants', label: 'View Tenants' },
        { id: 'edit_tenants', label: 'Edit Tenants' },
      ],
    },
    {
      title: 'Leases',
      permissions: [
        { id: 'view_leases', label: 'View Leases' },
        { id: 'edit_leases', label: 'Edit Leases' },
      ],
    },
    {
      title: 'Payments',
      permissions: [
        { id: 'view_payments', label: 'View Payments' },
        { id: 'edit_payments', label: 'Edit Payments' },
      ],
    },
    {
      title: 'Other',
      permissions: [
        { id: 'view_reports', label: 'View Reports' },
        { id: 'manage_team', label: 'Manage Team' },
      ],
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      if (isEditing && role) {
        await updateCustomRole(role.id, formData)
      } else {
        await createCustomRole(formData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Custom Role' : 'Create Custom Role'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={role?.name || ''}
              placeholder="e.g. Property Manager"
              required
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            
            {permissionGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h4 className="font-medium text-sm">{group.title}</h4>
                <div className="space-y-2">
                  {group.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        name={permission.id}
                        defaultChecked={permissions[permission.id]}
                      />
                      <Label htmlFor={permission.id}>{permission.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
