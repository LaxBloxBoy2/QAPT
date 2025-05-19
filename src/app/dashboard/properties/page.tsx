import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button asChild>
          <Link href="/dashboard/properties/new">Add Property</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty state */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>No properties yet</CardTitle>
            <CardDescription>
              Add your first property to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/properties/new">Add Property</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
