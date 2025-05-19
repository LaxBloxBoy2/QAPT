'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hasPermission, isPropertyOwner } from '@/lib/permissions'

// Get all tenants for a property
export async function getTenants(propertyId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user has permission to view tenants
  const canView = await hasPermission(user.id, propertyId, 'view_tenants')
  if (!canView) {
    throw new Error('Not authorized to view tenants for this property')
  }

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('property_id', propertyId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Get a single tenant by ID
export async function getTenant(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*, properties(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Check if user has permission to view this tenant
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const canView = await hasPermission(user.id, data.property_id, 'view_tenants')
  if (!canView) {
    throw new Error('Not authorized to view this tenant')
  }

  return data
}

// Create a new tenant
export async function createTenant(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const propertyId = formData.get('propertyId') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  // Check if user has permission to edit tenants
  const canEdit = await hasPermission(user.id, propertyId, 'edit_tenants')
  if (!canEdit) {
    throw new Error('Not authorized to add tenants to this property')
  }

  if (!propertyId || !fullName) {
    throw new Error('Property and full name are required')
  }

  const { data, error } = await supabase
    .from('tenants')
    .insert({
      property_id: propertyId,
      full_name: fullName,
      email: email || null,
      phone: phone || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/properties/${propertyId}/tenants`)
  redirect(`/dashboard/properties/${propertyId}/tenants`)
}

// Update a tenant
export async function updateTenant(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get the tenant to check property ID
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('property_id')
    .eq('id', id)
    .single()

  if (tenantError || !tenant) {
    throw new Error('Tenant not found')
  }

  // Check if user has permission to edit tenants
  const canEdit = await hasPermission(user.id, tenant.property_id, 'edit_tenants')
  if (!canEdit) {
    throw new Error('Not authorized to edit tenants for this property')
  }

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  if (!fullName) {
    throw new Error('Full name is required')
  }

  const { error } = await supabase
    .from('tenants')
    .update({
      full_name: fullName,
      email: email || null,
      phone: phone || null,
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/tenants/${id}`)
  revalidatePath(`/dashboard/properties/${tenant.property_id}/tenants`)
  redirect(`/dashboard/properties/${tenant.property_id}/tenants`)
}

// Delete a tenant
export async function deleteTenant(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get the tenant to check property ID
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('property_id')
    .eq('id', id)
    .single()

  if (tenantError || !tenant) {
    throw new Error('Tenant not found')
  }

  // Check if user has permission to edit tenants
  const canEdit = await hasPermission(user.id, tenant.property_id, 'edit_tenants')
  if (!canEdit) {
    throw new Error('Not authorized to delete tenants for this property')
  }

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/properties/${tenant.property_id}/tenants`)
  redirect(`/dashboard/properties/${tenant.property_id}/tenants`)
}
