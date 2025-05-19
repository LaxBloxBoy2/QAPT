'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PropertyGrid } from '@/components/properties/property-grid'
import { PropertyFilters } from '@/components/properties/property-filters'
import { Plus, Upload } from 'lucide-react'
import { Property } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        const supabase = createClient()

        // First check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('You must be logged in to view properties')
          setLoading(false)
          return
        }

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

        setProperties(uniqueProperties)
        setLoading(false)
      } catch (err) {
        console.error('Error loading properties:', err)
        setError('Failed to load properties')
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#0a3622] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#0a3622] hover:bg-[#0d4a2e] text-white"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your real estate portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="rounded-full shadow-sm bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
            <Link href="/dashboard/properties/new" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full border-[#0a3622] text-[#0a3622] hover:bg-[#0a3622]/10">
            <Upload className="h-5 w-5 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <PropertyFilters
          onSearch={(query) => {
            // Client-side filtering will be handled by the component
            console.log('Search query:', query)
          }}
          onFilter={(filters) => {
            // Client-side filtering will be handled by the component
            console.log('Filters:', filters)
          }}
        />
      </div>

      <PropertyGrid properties={properties} />
    </div>
  )
}
