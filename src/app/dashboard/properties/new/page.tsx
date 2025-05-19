import { PropertyForm } from '@/components/properties/property-form'

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Property</h1>
      <PropertyForm />
    </div>
  )
}
