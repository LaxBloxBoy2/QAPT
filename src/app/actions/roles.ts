'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isPropertyOwner } from '@/lib/permissions'
import { Permission } from '@/lib/permissions'

// Get all roles (built-in and custom)
export async function getRoles() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get built-in roles
  const { data: builtInRoles, error: builtInError } = await supabase
    .from('roles')
    .select('*')

  if (builtInError) {
    throw new Error(builtInError.message)
  }

  // Get custom roles created by the user
  const { data: customRoles, error: customError } = await supabase
    .from('custom_roles')
    .select('*')
    .eq('owner_id', user.id)

  if (customError) {
    throw new Error(customError.message)
  }

  return {
    builtIn: builtInRoles,
    custom: customRoles,
  }
}

// Get all role assignments for a property
export async function getRoleAssignments(propertyId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is the property owner
  const isOwner = await isPropertyOwner(user.id, propertyId)
  if (!isOwner) {
    throw new Error('Not authorized to view role assignments for this property')
  }

  const { data, error } = await supabase
    .from('role_assignments')
    .select(`
      *,
      users(*),
      roles(*),
      custom_roles(*)
    `)
    .eq('property_id', propertyId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Create a custom role
export async function createCustomRole(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string

  // Parse permissions from form data
  const permissions: Record<Permission, boolean> = {
    view_properties: formData.get('view_properties') === 'on',
    edit_properties: formData.get('edit_properties') === 'on',
    view_tenants: formData.get('view_tenants') === 'on',
    edit_tenants: formData.get('edit_tenants') === 'on',
    view_leases: formData.get('view_leases') === 'on',
    edit_leases: formData.get('edit_leases') === 'on',
    view_payments: formData.get('view_payments') === 'on',
    edit_payments: formData.get('edit_payments') === 'on',
    view_reports: formData.get('view_reports') === 'on',
    manage_team: formData.get('manage_team') === 'on',
  }

  if (!name) {
    throw new Error('Role name is required')
  }

  const { data, error } = await supabase
    .from('custom_roles')
    .insert({
      owner_id: user.id,
      name,
      permissions,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/settings/roles')
  redirect('/dashboard/settings/roles')
}

// Update a custom role
export async function updateCustomRole(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is the owner of this custom role
  const { data: role, error: roleError } = await supabase
    .from('custom_roles')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (roleError || !role) {
    throw new Error('Custom role not found')
  }

  if (role.owner_id !== user.id) {
    throw new Error('Not authorized to update this custom role')
  }

  const name = formData.get('name') as string

  // Parse permissions from form data
  const permissions: Record<Permission, boolean> = {
    view_properties: formData.get('view_properties') === 'on',
    edit_properties: formData.get('edit_properties') === 'on',
    view_tenants: formData.get('view_tenants') === 'on',
    edit_tenants: formData.get('edit_tenants') === 'on',
    view_leases: formData.get('view_leases') === 'on',
    edit_leases: formData.get('edit_leases') === 'on',
    view_payments: formData.get('view_payments') === 'on',
    edit_payments: formData.get('edit_payments') === 'on',
    view_reports: formData.get('view_reports') === 'on',
    manage_team: formData.get('manage_team') === 'on',
  }

  if (!name) {
    throw new Error('Role name is required')
  }

  const { error } = await supabase
    .from('custom_roles')
    .update({
      name,
      permissions,
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/settings/roles')
  redirect('/dashboard/settings/roles')
}

// Delete a custom role
export async function deleteCustomRole(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is the owner of this custom role
  const { data: role, error: roleError } = await supabase
    .from('custom_roles')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (roleError || !role) {
    throw new Error('Custom role not found')
  }

  if (role.owner_id !== user.id) {
    throw new Error('Not authorized to delete this custom role')
  }

  const { error } = await supabase
    .from('custom_roles')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/settings/roles')
  redirect('/dashboard/settings/roles')
}

// Assign a role to a user for a property
export async function assignRole(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const propertyId = formData.get('propertyId') as string
  const userEmail = formData.get('userEmail') as string
  const roleType = formData.get('roleType') as string
  const roleId = formData.get('roleId') as string
  const customRoleId = formData.get('customRoleId') as string

  // Check if user is the property owner
  const isOwner = await isPropertyOwner(user.id, propertyId)
  if (!isOwner) {
    throw new Error('Not authorized to assign roles for this property')
  }

  if (!propertyId || !userEmail || !roleType || (!roleId && !customRoleId)) {
    throw new Error('All fields are required')
  }

  // Find the user by email
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single()

  if (userError) {
    throw new Error(`User with email ${userEmail} not found`)
  }

  // Check if role assignment already exists
  const { data: existingAssignment, error: existingError } = await supabase
    .from('role_assignments')
    .select('id')
    .eq('user_id', targetUser.id)
    .eq('property_id', propertyId)
    .maybeSingle()

  if (existingAssignment) {
    // Update existing assignment
    const { error } = await supabase
      .from('role_assignments')
      .update({
        role_id: roleType === 'built-in' ? roleId : null,
        custom_role_id: roleType === 'custom' ? customRoleId : null,
      })
      .eq('id', existingAssignment.id)

    if (error) {
      throw new Error(error.message)
    }
  } else {
    // Create new assignment
    const { error } = await supabase
      .from('role_assignments')
      .insert({
        user_id: targetUser.id,
        property_id: propertyId,
        role_id: roleType === 'built-in' ? roleId : null,
        custom_role_id: roleType === 'custom' ? customRoleId : null,
      })

    if (error) {
      throw new Error(error.message)
    }
  }

  revalidatePath(`/dashboard/properties/${propertyId}/team`)
  redirect(`/dashboard/properties/${propertyId}/team`)
}

// Remove a role assignment
export async function removeRoleAssignment(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get the role assignment to check property ID
  const { data: assignment, error: assignmentError } = await supabase
    .from('role_assignments')
    .select('property_id')
    .eq('id', id)
    .single()

  if (assignmentError || !assignment) {
    throw new Error('Role assignment not found')
  }

  // Check if user is the property owner
  const isOwner = await isPropertyOwner(user.id, assignment.property_id)
  if (!isOwner) {
    throw new Error('Not authorized to remove role assignments for this property')
  }

  const { error } = await supabase
    .from('role_assignments')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/properties/${assignment.property_id}/team`)
  redirect(`/dashboard/properties/${assignment.property_id}/team`)
}
