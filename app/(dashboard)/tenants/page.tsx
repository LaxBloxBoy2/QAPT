import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Tenants</h1>
        </div>
        <Button>Add Tenant</Button>
      </div>
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-left">Lease End</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][i % 5]}
                          </p>
                          <p className="text-sm text-muted-foreground">tenant{i}@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">Unit {i + 101}</td>
                    <td className="px-4 py-2">Skyline Apartments</td>
                    <td className="px-4 py-2">{`${(i % 12) + 1}/15/${2024 + (i % 3)}`}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${i % 3 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {i % 3 === 0 ? 'Current' : i % 3 === 1 ? 'Pending' : 'Past'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
