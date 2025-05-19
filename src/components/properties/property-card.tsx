'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Property } from '@/types/database.types'
import { formatCurrency } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Format the address
  const formattedAddress = [
    property.street,
    property.city,
    property.state,
    property.zip
  ].filter(Boolean).join(', ')

  // Default image if none provided
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : '/placeholder-property.jpg'

  // Calculate occupancy percentage or use the provided one
  const occupancyPercentage = property.occupancy_percentage || 0

  // Format balance
  const balance = formatCurrency(property.balance || 0, 'EUR')

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group border-gray-200 dark:border-gray-800">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            property.type === 'single'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
          }`}>
            {property.type === 'single' ? 'Single Unit' : 'Multi Unit'}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-semibold mb-1 truncate group-hover:text-[#0a3622] transition-colors">{property.name}</h3>
        <p className="text-sm text-gray-500 mb-4 truncate">{formattedAddress}</p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Occupancy</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2 dark:bg-gray-700">
                <div
                  className="bg-[#0a3622] h-2 rounded-full"
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{occupancyPercentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Balance</p>
            <p className="text-lg font-semibold">{balance}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="outline" className="text-xs rounded-full">
            Accounting
          </Button>
          <Button size="sm" variant="outline" className="text-xs rounded-full">
            Tenants
          </Button>
          <Button size="sm" variant="outline" className="text-xs rounded-full">
            MR Requests
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
          <Link href={`/dashboard/properties/${property.id}`}>
            View Property
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
