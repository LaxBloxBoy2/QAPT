import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Finances</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Report</Button>
          <Button>Record Transaction</Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold">$52,400</p>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold">$18,300</p>
          <p className="text-sm text-muted-foreground">-5% from last month</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Net Income</h3>
          <p className="text-3xl font-bold">$34,100</p>
          <p className="text-sm text-muted-foreground">+18% from last month</p>
        </div>
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Outstanding Payments</h3>
          <p className="text-3xl font-bold">$3,200</p>
          <p className="text-sm text-muted-foreground">3 tenants</p>
        </div>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{`${(i % 30) + 1}/${(i % 12) + 1}/2024`}</td>
                    <td className="px-4 py-2">
                      {i % 3 === 0 ? 'Rent Payment' : i % 3 === 1 ? 'Maintenance Expense' : 'Utility Bill'}
                    </td>
                    <td className="px-4 py-2">Skyline Apartments</td>
                    <td className="px-4 py-2">
                      {i % 3 === 0 ? 'Income' : 'Expense'}
                    </td>
                    <td className={`px-4 py-2 ${i % 3 === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {i % 3 === 0 ? '+' : '-'}${(i + 5) * 100}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${i % 4 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : i % 4 === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : i % 4 === 2 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                        {i % 4 === 0 ? 'Completed' : i % 4 === 1 ? 'Pending' : i % 4 === 2 ? 'Failed' : 'Processing'}
                      </span>
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
