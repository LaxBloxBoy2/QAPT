import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leases</h1>
        <Button asChild>
          <Link href="/dashboard/leases/new">Add Lease</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Empty state */}
        <Card>
          <CardHeader>
            <CardTitle>No leases yet</CardTitle>
            <CardDescription>
              Add your first lease to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/leases/new">Add Lease</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
