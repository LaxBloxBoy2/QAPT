import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Properties</h1>
        </div>
        <Button>Add Property</Button>
      </div>
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Skyline Apartments {i + 1}</h3>
                <p className="text-sm text-muted-foreground">123 Main St, City</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm">Units: {(i + 3) * 4}</p>
                    <p className="text-sm">Occupancy: {85 + i}%</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
