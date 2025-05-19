'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'

// Get all leases for a property
export async function getLeases(propertyId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check if user has permission to view leases
  const canView = await hasPermission(user.id, propertyId, 'view_leases')
  if (!canView) {
    throw new Error('Not authorized to view leases for this property')
  }
  
  const { data, error } = await supabase
    .from('leases')
    .select('*, tenants(*)')
    .eq('property_id', propertyId)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Get a single lease by ID
export async function getLease(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leases')
    .select('*, tenants(*), properties(*)')
    .eq('id', id)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  // Check if user has permission to view this lease
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const canView = await hasPermission(user.id, data.property_id, 'view_leases')
  if (!canView) {
    throw new Error('Not authorized to view this lease')
  }
  
  return data
}

// Create a new lease
export async function createLease(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const propertyId = formData.get('propertyId') as string
  const tenantId = formData.get('tenantId') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const rentAmount = parseFloat(formData.get('rentAmount') as string)
  
  // Check if user has permission to edit leases
  const canEdit = await hasPermission(user.id, propertyId, 'edit_leases')
  if (!canEdit) {
    throw new Error('Not authorized to add leases to this property')
  }
  
  if (!propertyId || !tenantId || !startDate || !endDate || isNaN(rentAmount)) {
    throw new Error('All fields are required')
  }
  
  // Create the lease
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .insert({
      property_id: propertyId,
      tenant_id: tenantId,
      start_date: startDate,
      end_date: endDate,
      rent_amount: rentAmount,
    })
    .select()
    .single()
  
  if (leaseError) {
    throw new Error(leaseError.message)
  }
  
  // Update the tenant with the lease ID
  const { error: tenantError } = await supabase
    .from('tenants')
    .update({ lease_id: lease.id })
    .eq('id', tenantId)
  
  if (tenantError) {
    throw new Error(tenantError.message)
  }
  
  revalidatePath(`/dashboard/properties/${propertyId}/leases`)
  redirect(`/dashboard/properties/${propertyId}/leases`)
}

// Update a lease
export async function updateLease(id: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Get the lease to check property ID
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id')
    .eq('id', id)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  // Check if user has permission to edit leases
  const canEdit = await hasPermission(user.id, lease.property_id, 'edit_leases')
  if (!canEdit) {
    throw new Error('Not authorized to edit leases for this property')
  }
  
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const rentAmount = parseFloat(formData.get('rentAmount') as string)
  
  if (!startDate || !endDate || isNaN(rentAmount)) {
    throw new Error('All fields are required')
  }
  
  const { error } = await supabase
    .from('leases')
    .update({
      start_date: startDate,
      end_date: endDate,
      rent_amount: rentAmount,
    })
    .eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath(`/dashboard/leases/${id}`)
  revalidatePath(`/dashboard/properties/${lease.property_id}/leases`)
  redirect(`/dashboard/properties/${lease.property_id}/leases`)
}

// Delete a lease
export async function deleteLease(id: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Get the lease to check property ID and tenant ID
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id, tenant_id')
    .eq('id', id)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  // Check if user has permission to edit leases
  const canEdit = await hasPermission(user.id, lease.property_id, 'edit_leases')
  if (!canEdit) {
    throw new Error('Not authorized to delete leases for this property')
  }
  
  // Update the tenant to remove the lease ID
  const { error: tenantError } = await supabase
    .from('tenants')
    .update({ lease_id: null })
    .eq('id', lease.tenant_id)
  
  if (tenantError) {
    throw new Error(tenantError.message)
  }
  
  // Delete the lease
  const { error } = await supabase
    .from('leases')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath(`/dashboard/properties/${lease.property_id}/leases`)
  redirect(`/dashboard/properties/${lease.property_id}/leases`)
}
