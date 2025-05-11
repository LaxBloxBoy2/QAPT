"use client"

import { Building2, Loader2, Home, Building, Factory, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProperties } from "@/lib/hooks/use-properties"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function PropertiesPage() {
  const { profile } = useUser()
  const { data: properties, isLoading, error } = useProperties()

  // Helper function to get icon based on property type
  const getPropertyTypeIcon = (type?: string) => {
    switch (type) {
      case 'Residential':
        return <Home className="h-4 w-4" />;
      case 'Commercial':
        return <Building className="h-4 w-4" />;
      case 'Industrial':
        return <Factory className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  }

  // Helper function to get badge color based on status
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Under Maintenance':
        return 'warning';
      case 'Vacant':
        return 'secondary';
      case 'Fully Occupied':
        return 'success';
      default:
        return 'outline';
    }
  }
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
      ) : !profile?.organization_id ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">You are not associated with any organization.</p>
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
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{property.name}</h3>
                    <Badge variant={getStatusBadgeVariant(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPropertyTypeIcon(property.type)}
                      <span className="text-sm">{property.type}</span>
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
