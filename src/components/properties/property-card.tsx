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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-1 truncate">{property.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {property.type === 'single' ? 'Single Unit' : 'Multi Unit'}
        </p>
        <p className="text-sm text-gray-500 mb-4 truncate">{formattedAddress}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">Occupancy</p>
            <p className="font-medium">{occupancyPercentage}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <p className="font-medium">{balance}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            Accounting
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            Tenants
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            MR Requests
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/properties/${property.id}`}>
            View Property
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
