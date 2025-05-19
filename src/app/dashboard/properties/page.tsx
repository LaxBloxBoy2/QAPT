'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PropertyGrid } from '@/components/properties/property-grid'
import { PropertyFilters } from '@/components/properties/property-filters'
import { Plus, Upload } from 'lucide-react'
import { mockProperties } from '@/lib/mock-data'

export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#0a3622] border-t-transparent rounded-full animate-spin"></div>
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

      <PropertyGrid properties={mockProperties} />
    </div>
  )
}
