import { DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DoorOpen className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Leases</h1>
        </div>
        <Button>Create Lease</Button>
      </div>
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Lease ID</th>
                  <th className="px-4 py-2 text-left">Tenant</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Monthly Rent</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">L-{1000 + i}</td>
                    <td className="px-4 py-2">
                      {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][i % 5]}
                    </td>
                    <td className="px-4 py-2">Unit {i + 101}</td>
                    <td className="px-4 py-2">{`${(i % 12) + 1}/1/${2023 + (i % 2)}`}</td>
                    <td className="px-4 py-2">{`${(i % 12) + 1}/1/${2024 + (i % 2)}`}</td>
                    <td className="px-4 py-2">${(i + 10) * 100}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${i % 3 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                        {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Expiring Soon' : 'Renewal'}
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
