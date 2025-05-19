'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Role, CustomRole, Property } from '@/types/database.types'
import { assignRole } from '@/app/actions/roles'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface RoleAssignmentFormProps {
  property: Property
  builtInRoles: Role[]
  customRoles: CustomRole[]
}

export function RoleAssignmentForm({ 
  property,
  builtInRoles,
  customRoles
}: RoleAssignmentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roleType, setRoleType] = useState<'built-in' | 'custom'>('built-in')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [selectedCustomRoleId, setSelectedCustomRoleId] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add property ID
      formData.append('propertyId', property.id)
      
      // Add role type
      formData.append('roleType', roleType)
      
      // Add role ID based on type
      if (roleType === 'built-in' && selectedRoleId) {
        formData.append('roleId', selectedRoleId)
      } else if (roleType === 'custom' && selectedCustomRoleId) {
        formData.append('customRoleId', selectedCustomRoleId)
      }
      
      await assignRole(formData)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assign Team Member</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userEmail">User Email</Label>
            <Input
              id="userEmail"
              name="userEmail"
              type="email"
              placeholder="Enter team member's email"
              required
            />
            <p className="text-sm text-gray-500">
              The user must have an account in the system
            </p>
          </div>
          
          <div className="space-y-3">
            <Label>Role Type</Label>
            <RadioGroup 
              value={roleType} 
              onValueChange={(value) => setRoleType(value as 'built-in' | 'custom')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="built-in" id="built-in" />
                <Label htmlFor="built-in">Built-in Role</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Role</Label>
              </div>
            </RadioGroup>
          </div>
          
          {roleType === 'built-in' && (
            <div className="space-y-2">
              <Label htmlFor="roleId">Select Role</Label>
              <Select
                name="roleId"
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {builtInRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {roleType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customRoleId">Select Custom Role</Label>
              <Select
                name="customRoleId"
                value={selectedCustomRoleId}
                onValueChange={setSelectedCustomRoleId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a custom role" />
                </SelectTrigger>
                <SelectContent>
                  {customRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customRoles.length === 0 && (
                <p className="text-sm text-red-500">
                  No custom roles available. Create a custom role first.
                </p>
              )}
            </div>
          )}
          
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
            disabled={isSubmitting || (roleType === 'custom' && customRoles.length === 0)}
          >
            {isSubmitting ? 'Assigning...' : 'Assign Role'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
