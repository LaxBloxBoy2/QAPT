import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProperty } from '@/app/actions/properties'
import { notFound } from 'next/navigation'
import { formatAddress, formatCurrency } from '@/lib/utils'
import { Building2, Home, Pencil, Trash2, Users, FileText, BarChart4, Wrench } from 'lucide-react'

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  try {
    const resolvedParams = await params
    const property = await getProperty(resolvedParams.id)

    // Format the address
    const address = formatAddress(property)

    // Get the main image or use a placeholder
    const mainImage = property.images && property.images.length > 0
      ? property.images[0]
      : '/placeholder-property.jpg'

    // Format financial values
    const marketRent = formatCurrency(property.market_rent || 0, 'EUR')
    const deposit = formatCurrency(property.deposit || 0, 'EUR')
    const balance = formatCurrency(property.balance || 0, 'EUR')

    // Calculate occupancy percentage
    const occupancyPercentage = property.occupancy_percentage || 0

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              {property.type === 'single' ? (
                <Home className="h-6 w-6 text-primary" />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
              <h1 className="text-3xl font-bold">{property.name}</h1>
            </div>
            <p className="text-gray-500 mt-1">{address}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/properties/${property.id}/edit`} className="flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/dashboard/properties/${property.id}/delete`} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Overview</CardTitle>
                    <CardDescription>Basic information about this property</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Type</h3>
                        <p>{property.type === 'single' ? 'Single Unit' : 'Multi Unit'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Year Built</h3>
                        <p>{property.year_built || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">MLS #</h3>
                        <p>{property.mls_number || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Created</h3>
                        <p>{new Date(property.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                    <CardDescription>Specific information about this property</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bedrooms</h3>
                        <p>{property.beds || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bathrooms</h3>
                        <p>{property.baths || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Size</h3>
                        <p>{property.size_sqft ? `${property.size_sqft} sqft` : 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Manufactured</h3>
                        <p>{property.manufactured ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Market Rent</h3>
                        <p>{marketRent}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Security Deposit</h3>
                        <p>{deposit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Amenities</CardTitle>
                    <CardDescription>What this property offers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.features && property.features.length > 0 ? (
                          property.features.map((feature: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                              {feature}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400">No features listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities && property.amenities.length > 0 ? (
                          property.amenities.map((amenity: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                              {amenity}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400">No amenities listed</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Property-related documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {property.attachments && property.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {property.attachments.map((doc: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{doc.split('/').pop()}</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc} target="_blank" rel="noopener noreferrer">View</a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No documents attached</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Status</CardTitle>
                <CardDescription>Current status and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Occupancy</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${occupancyPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{occupancyPercentage}%</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                  <p className="text-xl font-bold">{balance}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/properties/${property.id}/tenants`} className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  Tenants
                </Link>
              </Button>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/properties/${property.id}/accounting`} className="flex items-center justify-center gap-2">
                  <BarChart4 className="h-4 w-4" />
                  Accounting
                </Link>
              </Button>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/properties/${property.id}/maintenance`} className="flex items-center justify-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Maintenance
                </Link>
              </Button>
            </div>

            {property.type === 'multi' && (
              <Card>
                <CardHeader>
                  <CardTitle>Units</CardTitle>
                  <CardDescription>Manage property units</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/properties/${property.id}/units`}>
                      Manage Units
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
