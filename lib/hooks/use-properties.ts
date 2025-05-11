"use client"

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/lib/supabase'
import { useUser } from '@/lib/user-context'

export type Property = Tables<'properties'> & {
  type?: string
  status?: string
}

export function useProperties() {
  const { profile } = useUser()
  const organizationId = profile?.organization_id

  return useQuery({
    queryKey: ['properties', organizationId],
    queryFn: async (): Promise<Property[]> => {
      if (!organizationId) {
        return []
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name')

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      // Add placeholder type and status fields
      // In a real app, these would come from the database
      return data.map(property => ({
        ...property,
        type: getRandomPropertyType(),
        status: getRandomPropertyStatus()
      }))
    },
    enabled: !!organizationId
  })
}

export function useProperty(propertyId: string | undefined) {
  const { profile } = useUser()
  const organizationId = profile?.organization_id

  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async (): Promise<Property | null> => {
      if (!propertyId || !organizationId) {
        return null
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('organization_id', organizationId)
        .single()

      if (error) {
        throw new Error(`Error fetching property: ${error.message}`)
      }

      return {
        ...data,
        type: getRandomPropertyType(),
        status: getRandomPropertyStatus()
      }
    },
    enabled: !!propertyId && !!organizationId
  })
}

// Helper functions for demo purposes
function getRandomPropertyType(): string {
  const types = ['Residential', 'Commercial', 'Mixed-Use', 'Industrial']
  return types[Math.floor(Math.random() * types.length)]
}

function getRandomPropertyStatus(): string {
  const statuses = ['Active', 'Under Maintenance', 'Vacant', 'Fully Occupied']
  return statuses[Math.floor(Math.random() * statuses.length)]
}
