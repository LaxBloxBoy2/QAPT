'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Plus, Upload, Building2, Home } from 'lucide-react'

// Static property data
const staticProperties = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd, Los Angeles, CA 90210',
    type: 'multi',
    occupancyPercentage: 85,
    balance: 12500,
    image: '/placeholder-property.jpg'
  },
  {
    id: '2',
    name: 'Ocean View Condo',
    address: '456 Beach Drive, Miami, FL 33139',
    type: 'single',
    occupancyPercentage: 100,
    balance: 3200,
    image: '/placeholder-property.jpg'
  },
  {
    id: '3',
    name: 'Downtown Loft',
    address: '789 Main Street, New York, NY 10001',
    type: 'single',
    occupancyPercentage: 0,
    balance: 0,
    image: '/placeholder-property.jpg'
  }
]

export default function PropertiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your real estate portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" className="rounded-lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </Button>
          <Button variant="outline" size="lg" className="rounded-lg">
            <Upload className="h-5 w-5 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Simple search bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="relative h-48">
              <Image
                src={property.image}
                alt={property.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 bg-card rounded-full px-2 py-1 text-xs font-medium flex items-center">
                {property.type === 'multi' ? (
                  <>
                    <Building2 className="h-3 w-3 mr-1 text-primary" />
                    <span>Multi Unit</span>
                  </>
                ) : (
                  <>
                    <Home className="h-3 w-3 mr-1 text-primary" />
                    <span>Single Unit</span>
                  </>
                )}
              </div>
            </div>

            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-1 truncate group-hover:text-primary transition-colors">{property.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 truncate">{property.address}</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">{property.occupancyPercentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${property.occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Balance</span>
                  <span className="font-semibold">€{property.balance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Button className="w-full rounded-md">
                View Property
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
