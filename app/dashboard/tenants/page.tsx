import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <Button asChild>
          <Link href="/dashboard/tenants/new">Add Tenant</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Empty state */}
        <Card>
          <CardHeader>
            <CardTitle>No tenants yet</CardTitle>
            <CardDescription>
              Add your first tenant to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/tenants/new">Add Tenant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
