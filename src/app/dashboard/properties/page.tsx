import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PropertyGrid } from '@/components/properties/property-grid'
import { PropertyFilters } from '@/components/properties/property-filters'
import { getProperties } from '@/app/actions/properties'
import { Plus, Upload } from 'lucide-react'

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Properties</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/properties/new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

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

      <PropertyGrid properties={properties} />
    </div>
  )
}
