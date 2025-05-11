import { FileText, FolderOpen, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Documents</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              className="h-10 rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-medium">Leases</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">12 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 2 days ago</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-medium">Property Documents</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">24 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 1 week ago</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-medium">Tenant Applications</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">8 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 3 days ago</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-medium">Maintenance Reports</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">15 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 5 days ago</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-medium">Financial Reports</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">10 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-medium">Insurance Documents</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">6 documents</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: 1 month ago</p>
        </div>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Documents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Date Added</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Document-{1000 + i}.pdf</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">PDF</td>
                    <td className="px-4 py-2">
                      {i % 5 === 0 ? 'Lease' : i % 5 === 1 ? 'Property' : i % 5 === 2 ? 'Tenant' : i % 5 === 3 ? 'Maintenance' : 'Financial'}
                    </td>
                    <td className="px-4 py-2">{`${(i % 30) + 1}/${(i % 12) + 1}/2024`}</td>
                    <td className="px-4 py-2">{(i + 1) * 0.5} MB</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
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
