'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

export default function TenantsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-gray-500 mt-1">Manage your property tenants</p>
        </div>
        <Button asChild className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
          <Link href="/dashboard/tenants/new" className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Tenant
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <CardHeader>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle>No tenants yet</CardTitle>
              <CardDescription>
                Add your first tenant to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild className="rounded-full bg-[#0a3622] hover:bg-[#0d4a2e] text-white">
                <Link href="/dashboard/tenants/new" className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add Your First Tenant
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
