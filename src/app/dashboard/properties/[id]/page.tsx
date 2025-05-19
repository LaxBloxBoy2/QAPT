import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProperty } from '@/app/actions/properties'
import { notFound } from 'next/navigation'

interface PropertyDetailPageProps {
  params: {
    id: string
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  try {
    const property = await getProperty(params.id)
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/properties/${property.id}/edit`}>Edit Property</Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/dashboard/properties/${property.id}/delete`}>Delete</Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Basic information about this property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p>{property.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Units</h3>
                <p>{property.unit_count}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p>{new Date(property.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenants</CardTitle>
              <CardDescription>Manage tenants for this property</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/dashboard/properties/${property.id}/tenants`}>
                  View Tenants
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Leases</CardTitle>
              <CardDescription>Manage leases for this property</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/dashboard/properties/${property.id}/leases`}>
                  View Leases
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Manage team members and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/dashboard/properties/${property.id}/team`}>
                  Manage Team
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
