import { BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Properties</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Units</h3>
          <p className="text-3xl font-bold">48</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Occupancy Rate</h3>
          <p className="text-3xl font-bold">92%</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Monthly Revenue</h3>
          <p className="text-3xl font-bold">$52,400</p>
        </div>
      </div>
      <div className="rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">New Lease Signed</p>
              <p className="text-sm text-muted-foreground">Unit 303, Skyline Apartments</p>
            </div>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Maintenance Request</p>
              <p className="text-sm text-muted-foreground">Unit 101, Urban Heights</p>
            </div>
            <p className="text-sm text-muted-foreground">5 hours ago</p>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Rent Payment Received</p>
              <p className="text-sm text-muted-foreground">Unit 205, Parkview Residences</p>
            </div>
            <p className="text-sm text-muted-foreground">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  )
}
