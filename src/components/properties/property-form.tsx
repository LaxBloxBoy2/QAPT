'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Property } from '@/types/database.types'
import { createProperty, updateProperty } from '@/app/actions/properties'
import { PropertyUploader } from './property-uploader'
import { DocumentUploader } from './document-uploader'
import { PropertyTypeSelector } from './property-type-selector'
import { PropertyFeaturesSelector } from './property-features-selector'

interface PropertyFormProps {
  property?: Property
  isEditing?: boolean
}

export function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [propertyType, setPropertyType] = useState<'single' | 'multi'>(property?.type || 'single')
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [attachments, setAttachments] = useState<string[]>(property?.attachments || [])
  const [features, setFeatures] = useState<string[]>(property?.features || [])
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [])
  const [isManufactured, setIsManufactured] = useState<boolean>(property?.manufactured || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Add the arrays as JSON strings
      formData.append('type', propertyType)
      formData.append('manufactured', isManufactured.toString())
      formData.append('images', JSON.stringify(images))
      formData.append('attachments', JSON.stringify(attachments))
      formData.append('features', JSON.stringify(features))
      formData.append('amenities', JSON.stringify(amenities))

      if (isEditing && property) {
        await updateProperty(property.id, formData)
      } else {
        await createProperty(formData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  // Suggested property features
  const suggestedFeatures = [
    'Alarm', 'Furnished', 'Fireplace', 'Hardwood Floors', 'Balcony', 'Patio',
    'Garage', 'Basement', 'Storage', 'Washer/Dryer', 'Dishwasher', 'Microwave'
  ]

  // Suggested property amenities
  const suggestedAmenities = [
    'Pool', 'Gym', 'BBQ', 'Game Room', 'Elevator', 'Playground',
    'Tennis Court', 'Basketball Court', 'Dog Park', 'Clubhouse', 'Lounge'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
              <CardDescription>Upload photos of your property</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyUploader
                initialImages={property?.images}
                onImagesChange={setImages}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Type</CardTitle>
              <CardDescription>Select the type of property</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyTypeSelector
                initialValue={property?.type || 'single'}
                onValueChange={setPropertyType}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic details about your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={property?.name || ''}
                  placeholder="e.g. Sunset Apartments"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  defaultValue={property?.street || ''}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={property?.city || ''}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={property?.state || ''}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip/Postal Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    defaultValue={property?.zip || ''}
                    placeholder="Zip Code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    defaultValue={property?.country || ''}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    defaultValue={property?.year_built || ''}
                    placeholder="e.g. 2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mlsNumber">MLS Number</Label>
                  <Input
                    id="mlsNumber"
                    name="mlsNumber"
                    defaultValue={property?.mls_number || ''}
                    placeholder="MLS #"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Details Tab */}
        <TabsContent value="details" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Specific information about your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input
                    id="beds"
                    name="beds"
                    type="number"
                    min="0"
                    defaultValue={property?.beds || ''}
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Bathrooms</Label>
                  <Input
                    id="baths"
                    name="baths"
                    type="number"
                    min="0"
                    step="0.5"
                    defaultValue={property?.baths || ''}
                    placeholder="Number of bathrooms"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeSqft">Size (sqft)</Label>
                  <Input
                    id="sizeSqft"
                    name="sizeSqft"
                    type="number"
                    min="0"
                    defaultValue={property?.size_sqft || ''}
                    placeholder="Square footage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketRent">Market Rent (€)</Label>
                  <Input
                    id="marketRent"
                    name="marketRent"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={property?.market_rent || ''}
                    placeholder="Monthly rent amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (€)</Label>
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={property?.deposit || ''}
                    placeholder="Security deposit amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Is this a manufactured/mobile home?</Label>
                <RadioGroup
                  defaultValue={isManufactured ? 'true' : 'false'}
                  onValueChange={(value) => setIsManufactured(value === 'true')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="manufactured-yes" />
                    <Label htmlFor="manufactured-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="manufactured-no" />
                    <Label htmlFor="manufactured-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
              <CardDescription>Select features available in this property</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyFeaturesSelector
                title="Property Features"
                description="Select or add features available in this property"
                initialFeatures={property?.features || []}
                onFeaturesChange={setFeatures}
                suggestions={suggestedFeatures}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Amenities</CardTitle>
              <CardDescription>Select amenities available in this property</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyFeaturesSelector
                title="Property Amenities"
                description="Select or add amenities available in this property"
                initialFeatures={property?.amenities || []}
                onFeaturesChange={setAmenities}
                suggestions={suggestedAmenities}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Documents</CardTitle>
              <CardDescription>Upload important documents related to this property</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploader
                initialDocuments={property?.attachments}
                onDocumentsChange={setAttachments}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  )
}
