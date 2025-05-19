'use client'

import Link from 'next/link'
import { Property } from '@/types/database.types'
import { PropertyCard } from './property-card'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <Building2 className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No properties found</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">Add your first property to start managing your real estate portfolio</p>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/dashboard/properties/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Property
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
