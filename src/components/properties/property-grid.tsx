'use client'

import { Property } from '@/types/database.types'
import { PropertyCard } from './property-card'

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500">No properties found</h3>
        <p className="text-gray-400">Add a property to get started</p>
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
