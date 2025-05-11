import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Units</h1>
        </div>
        <Button>Add Unit</Button>
      </div>
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Tenant</th>
                  <th className="px-4 py-2 text-left">Rent</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">Unit {i + 101}</td>
                    <td className="px-4 py-2">Skyline Apartments</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${i % 3 === 0 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : i % 3 === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {i % 3 === 0 ? 'Vacant' : i % 3 === 1 ? 'Occupied' : 'Maintenance'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{i % 3 === 1 ? 'John Doe' : '-'}</td>
                    <td className="px-4 py-2">${(i + 10) * 100}</td>
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
