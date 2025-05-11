"use client"

import { Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProperties } from "@/lib/query-hooks"
import { useAuthStore } from "@/lib/auth-store"
import Link from "next/link"

export default function PropertiesPage() {
  const { currentOrganization } = useAuthStore()
  const { data: properties, isLoading, error } = useProperties()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Properties</h1>
        </div>
        <Button>Add Property</Button>
      </div>
      {isLoading ? (
        <div className="flex h-40 w-full items-center justify-center rounded-lg border">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          <p>Error loading properties. Please try again.</p>
        </div>
      ) : !currentOrganization ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">Please select an organization to view properties.</p>
        </div>
      ) : properties?.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No properties found for this organization.</p>
          <Button className="mt-4">Add Your First Property</Button>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties?.map((property) => (
                <div key={property.id} className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">{property.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {/* We would need to fetch units count from the API */}
                      <p className="text-sm">Property ID: {property.id.substring(0, 8)}</p>
                    </div>
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
