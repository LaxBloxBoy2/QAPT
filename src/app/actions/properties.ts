'use server'

import { createClient } from '@/lib/supabase/server-async'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isPropertyOwner } from '@/lib/permissions'

// Get all properties for a user
export async function getProperties() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get properties owned by the user
  const { data: ownedProperties, error: ownedError } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', user.id)

  if (ownedError) {
    throw new Error(ownedError.message)
  }

  // Get properties where the user has a role assignment
  const { data: assignedProperties, error: assignedError } = await supabase
    .from('role_assignments')
    .select('properties(*)')
    .eq('user_id', user.id)

  if (assignedError) {
    throw new Error(assignedError.message)
  }

  // Combine and deduplicate properties
  const assignedPropertiesData = assignedProperties
    .map(assignment => assignment.properties)
    .filter(Boolean)

  const allProperties = [...ownedProperties, ...assignedPropertiesData]

  // Deduplicate by property ID
  const uniqueProperties = Array.from(
    new Map(allProperties.map(property => [property.id, property])).values()
  )

  return uniqueProperties
}

// Get a single property by ID
export async function getProperty(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Create a new property
export async function createProperty(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const address = formData.get('address') as string
  const unitCount = parseInt(formData.get('unitCount') as string) || 1

  if (!title || !address) {
    throw new Error('Title and address are required')
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user.id,
      title,
      address,
      unit_count: unitCount,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/properties')
  redirect('/dashboard/properties')
}

// Update a property
export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is the owner
  const isOwner = await isPropertyOwner(user.id, id)
  if (!isOwner) {
    throw new Error('Not authorized to update this property')
  }

  const title = formData.get('title') as string
  const address = formData.get('address') as string
  const unitCount = parseInt(formData.get('unitCount') as string) || 1

  if (!title || !address) {
    throw new Error('Title and address are required')
  }

  const { error } = await supabase
    .from('properties')
    .update({
      title,
      address,
      unit_count: unitCount,
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/properties/${id}`)
  revalidatePath('/dashboard/properties')
  redirect('/dashboard/properties')
}

// Delete a property
export async function deleteProperty(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is the owner
  const isOwner = await isPropertyOwner(user.id, id)
  if (!isOwner) {
    throw new Error('Not authorized to delete this property')
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/properties')
  redirect('/dashboard/properties')
}
