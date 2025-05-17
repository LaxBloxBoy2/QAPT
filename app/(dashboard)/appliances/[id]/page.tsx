"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, isAfter, isBefore } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Loader2,
  Pencil,
  PlusCircle,
  RefrigeratorIcon,
  Shield,
  ShieldAlert,
  Trash2,
  WrenchIcon
} from "lucide-react"
import { Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditApplianceDialog, DeleteApplianceDialog } from "@/components/appliance-dialog"
import { useApplianceById } from "@/lib/hooks/use-appliances"
import { ApplianceServiceLogs } from "@/components/appliance-service-log"
import { ApplianceDocuments } from "@/components/appliance-documents"
import { ApplianceReminders } from "@/components/appliance-reminders"

import { use } from "react"

export default function ApplianceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { data: appliance, isLoading, error } = useApplianceById(resolvedParams.id)

  // Check if warranty is active
  const hasWarranty = appliance?.warranty_start && appliance?.warranty_end
  const today = new Date()
  const warrantyStart = appliance?.warranty_start ? new Date(appliance.warranty_start) : null
  const warrantyEnd = appliance?.warranty_end ? new Date(appliance.warranty_end) : null

  let warrantyStatus: 'active' | 'expired' | 'none' = 'none'

  if (warrantyStart && warrantyEnd) {
    if (isAfter(today, warrantyStart) && isBefore(today, warrantyEnd)) {
      warrantyStatus = 'active'
    } else if (isAfter(today, warrantyEnd)) {
      warrantyStatus = 'expired'
    }
  }

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Back button and actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/appliances')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Appliances
        </Button>

        {appliance && (
          <div className="flex items-center gap-2">
            <EditApplianceDialog
              appliance={appliance}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              }
            />
            <DeleteApplianceDialog
              appliance={appliance}
              trigger={
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              }
              onSuccess={() => router.push('/appliances')}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-40 w-full items-center justify-center rounded-lg border">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          <p>Error loading appliance details. Please try again.</p>
        </div>
      ) : !appliance ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">Appliance not found.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Static & visual info (sticky on desktop) */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="lg:sticky lg:top-6">
              {/* Appliance Overview Card */}
              <Card className="border shadow-sm overflow-hidden bg-white">
                {/* Appliance Image */}
                <div className="relative">
                  {appliance.photo_url ? (
                    <div className="w-full h-64 bg-white flex items-center justify-center">
                      <img
                        src={appliance.photo_url}
                        alt={`${appliance.brand} ${appliance.model}`}
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-50">
                      <div className="p-6 rounded-full bg-[#285755]/5">
                        <RefrigeratorIcon className="h-20 w-20 text-[#285755]/40" />
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`px-3 py-1.5 text-sm font-medium ${
                        appliance.status === 'needs_service'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : appliance.status === 'out_of_order'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {appliance.status === 'needs_service' ? (
                          <WrenchIcon className="h-3.5 w-3.5" />
                        ) : appliance.status === 'out_of_order' ? (
                          <AlertCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {appliance.status === 'needs_service'
                            ? 'Needs Service'
                            : appliance.status === 'out_of_order'
                              ? 'Out of Order'
                              : 'Operational'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 bg-[#285755] hover:bg-[#285755]/90 text-white">
                        {appliance.category}
                      </Badge>
                      <CardTitle className="text-2xl font-bold mt-1">
                        {appliance.brand}
                      </CardTitle>
                      {appliance.model && (
                        <p className="text-gray-500 mt-1">Model: {appliance.model}</p>
                      )}
                    </div>

                    {warrantyStatus !== 'none' && (
                      <Badge
                        className={`text-sm py-1.5 px-3 font-medium ${
                          warrantyStatus === 'active'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {warrantyStatus === 'active' ? (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Warranty Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4" />
                            <span>Warranty Expired</span>
                          </div>
                        )}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Separator className="my-4" />

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#285755]/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-[#285755]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property</p>
                        <p className="font-medium">{appliance.property?.name || 'Unknown Property'}</p>
                      </div>
                    </div>

                    {appliance.serial && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#285755]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#285755]">#</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Serial Number</p>
                          <p className="font-medium font-mono">{appliance.serial}</p>
                        </div>
                      </div>
                    )}

                    {appliance.price && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#285755]/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-5 w-5 text-[#285755]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Purchase Price</p>
                          <p className="font-medium">
                            ${Number(appliance.price).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {appliance.install_date && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#285755]/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-[#285755]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Installation Date</p>
                          <p className="font-medium">{format(new Date(appliance.install_date), 'MMMM d, yyyy')}</p>
                        </div>
                      </div>
                    )}

                    {hasWarranty && (
                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-[#285755]" />
                          Warranty Information
                        </h3>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">
                              {format(new Date(appliance.warranty_start!), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">
                              {format(new Date(appliance.warranty_end!), 'MMM d, yyyy')}
                            </p>
                          </div>

                          {appliance.warranty_file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2 gap-2 bg-white"
                              onClick={() => window.open(appliance.warranty_file_url, '_blank')}
                            >
                              View Warranty Document
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Tabbed dynamic content */}
          <div className="w-full lg:w-2/3">
            <Card className="border shadow-sm bg-white overflow-hidden">
              <Tabs defaultValue="details" className="w-full">
                <div className="border-b">
                  <div className="px-4">
                    <TabsList className="bg-transparent h-14 p-0 w-full justify-start gap-2">
                      <TabsTrigger
                        value="details"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#285755] data-[state=active]:text-[#285755] rounded-none px-4 h-14"
                      >
                        Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="documents"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#285755] data-[state=active]:text-[#285755] rounded-none px-4 h-14"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="service"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#285755] data-[state=active]:text-[#285755] rounded-none px-4 h-14"
                      >
                        Service History
                      </TabsTrigger>
                      <TabsTrigger
                        value="reminders"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#285755] data-[state=active]:text-[#285755] rounded-none px-4 h-14"
                      >
                        Reminders
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <TabsContent value="details" className="mt-0 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Appliance Details</h2>
                  </div>

                  {appliance.details ? (
                    <div className="whitespace-pre-wrap bg-gray-50 p-5 rounded-lg border border-gray-100">
                      {appliance.details}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-500">No additional details available for this appliance.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-0 p-6">
                  <ApplianceDocuments applianceId={appliance.id} />
                </TabsContent>

                <TabsContent value="service" className="mt-0 p-6">
                  <ApplianceServiceLogs applianceId={appliance.id} />
                </TabsContent>

                <TabsContent value="reminders" className="mt-0 p-6">
                  <ApplianceReminders
                    applianceId={appliance.id}
                    propertyId={appliance.property_id}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
