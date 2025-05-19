'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockProperties } from '@/lib/mock-data'

export default function DashboardPage() {
  const [propertyCount, setPropertyCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPropertyCount(mockProperties.length)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your property portfolio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Total properties managed</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">{propertyCount}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Total active tenants</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">0</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>This month's revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">$0.00</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No recent payments</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Upcoming Leases</CardTitle>
            <CardDescription>Leases ending soon</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No upcoming lease expirations</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
