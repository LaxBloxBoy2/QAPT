import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PropertyGrid } from '@/components/properties/property-grid'
import { PropertyFilters } from '@/components/properties/property-filters'
import { getProperties } from '@/app/actions/properties'
import { Plus, Upload } from 'lucide-react'

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your real estate portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="rounded-full shadow-sm">
            <Link href="/dashboard/properties/new" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full">
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
