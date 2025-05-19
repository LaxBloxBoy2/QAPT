import { PropertyForm } from '@/components/properties/property-form'
import { getProperty } from '@/app/actions/properties'
import { notFound } from 'next/navigation'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  try {
    const property = await getProperty(params.id)
    
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Property</h1>
        <PropertyForm property={property} isEditing />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
