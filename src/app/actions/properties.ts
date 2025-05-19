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

  // Basic information
  const name = formData.get('name') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zip = formData.get('zip') as string
  const country = formData.get('country') as string
  const yearBuilt = formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : undefined
  const mlsNumber = formData.get('mlsNumber') as string || undefined

  // Property type
  const type = formData.get('type') as 'single' | 'multi'

  // Property details
  const beds = formData.get('beds') ? parseInt(formData.get('beds') as string) : undefined
  const baths = formData.get('baths') ? parseInt(formData.get('baths') as string) : undefined
  const sizeSqft = formData.get('sizeSqft') ? parseFloat(formData.get('sizeSqft') as string) : undefined
  const marketRent = formData.get('marketRent') ? parseFloat(formData.get('marketRent') as string) : undefined
  const deposit = formData.get('deposit') ? parseFloat(formData.get('deposit') as string) : undefined

  // Additional details
  const manufactured = formData.get('manufactured') === 'true'

  // Features and amenities
  const featuresJson = formData.get('features') as string
  const amenitiesJson = formData.get('amenities') as string
  const features = featuresJson ? JSON.parse(featuresJson) : []
  const amenities = amenitiesJson ? JSON.parse(amenitiesJson) : []

  // Images and documents
  const imagesJson = formData.get('images') as string
  const attachmentsJson = formData.get('attachments') as string
  const images = imagesJson ? JSON.parse(imagesJson) : []
  const attachments = attachmentsJson ? JSON.parse(attachmentsJson) : []

  if (!name || !street || !city || !state || !zip || !country) {
    throw new Error('Name and address fields are required')
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user.id,
      name,
      street,
      city,
      state,
      zip,
      country,
      year_built: yearBuilt,
      mls_number: mlsNumber,
      type,
      manufactured,
      beds,
      baths,
      size_sqft: sizeSqft,
      market_rent: marketRent,
      deposit,
      amenities,
      features,
      attachments,
      images,
      occupancy_percentage: 0, // Default value
      balance: 0 // Default value
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

  // Basic information
  const name = formData.get('name') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zip = formData.get('zip') as string
  const country = formData.get('country') as string
  const yearBuilt = formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : undefined
  const mlsNumber = formData.get('mlsNumber') as string || undefined

  // Property type
  const type = formData.get('type') as 'single' | 'multi'

  // Property details
  const beds = formData.get('beds') ? parseInt(formData.get('beds') as string) : undefined
  const baths = formData.get('baths') ? parseInt(formData.get('baths') as string) : undefined
  const sizeSqft = formData.get('sizeSqft') ? parseFloat(formData.get('sizeSqft') as string) : undefined
  const marketRent = formData.get('marketRent') ? parseFloat(formData.get('marketRent') as string) : undefined
  const deposit = formData.get('deposit') ? parseFloat(formData.get('deposit') as string) : undefined

  // Additional details
  const manufactured = formData.get('manufactured') === 'true'

  // Features and amenities
  const featuresJson = formData.get('features') as string
  const amenitiesJson = formData.get('amenities') as string
  const features = featuresJson ? JSON.parse(featuresJson) : []
  const amenities = amenitiesJson ? JSON.parse(amenitiesJson) : []

  // Images and documents
  const imagesJson = formData.get('images') as string
  const attachmentsJson = formData.get('attachments') as string
  const images = imagesJson ? JSON.parse(imagesJson) : []
  const attachments = attachmentsJson ? JSON.parse(attachmentsJson) : []

  if (!name || !street || !city || !state || !zip || !country) {
    throw new Error('Name and address fields are required')
  }

  const { error } = await supabase
    .from('properties')
    .update({
      name,
      street,
      city,
      state,
      zip,
      country,
      year_built: yearBuilt,
      mls_number: mlsNumber,
      type,
      manufactured,
      beds,
      baths,
      size_sqft: sizeSqft,
      market_rent: marketRent,
      deposit,
      amenities,
      features,
      attachments,
      images
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
