"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  CalendarIcon, 
  FileIcon, 
  Loader2, 
  PlusCircle, 
  Settings, 
  Trash2, 
  WrenchIcon, 
  XCircle 
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { ApplianceServiceLog, useApplianceServiceLogs, useCreateApplianceServiceLog, useDeleteApplianceServiceLog } from "@/lib/hooks/use-appliance-service-logs"

// Service log form schema
const serviceLogSchema = z.object({
  service_date: z.date({
    required_error: "Service date is required",
  }),
  service_type: z.enum(["maintenance", "repair", "inspection", "replacement", "other"], {
    required_error: "Service type is required",
  }),
  description: z.string().min(1, "Description is required"),
  cost: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  provider_name: z.string().optional(),
  attachment_file: z.instanceof(File).optional(),
})

type ServiceLogFormValues = z.infer<typeof serviceLogSchema>

interface ApplianceServiceLogsProps {
  applianceId: string
}

export function ApplianceServiceLogs({ applianceId }: ApplianceServiceLogsProps) {
  const { data: serviceLogs = [], isLoading } = useApplianceServiceLogs(applianceId)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Service History</h3>
        <AddServiceLogDialog 
          applianceId={applianceId} 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>

      {serviceLogs.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <WrenchIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No service history</h3>
          <p className="text-gray-500 mt-1 mb-4">No service records have been added for this appliance yet.</p>
          <Button 
            variant="outline" 
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Service Record
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {serviceLogs.map((log) => (
            <ServiceLogCard key={log.id} log={log} applianceId={applianceId} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ServiceLogCardProps {
  log: ApplianceServiceLog
  applianceId: string
}

function ServiceLogCard({ log, applianceId }: ServiceLogCardProps) {
  const deleteServiceLog = useDeleteApplianceServiceLog()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this service record? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteServiceLog.mutateAsync({ id: log.id, applianceId })
        toast.success("Service record deleted successfully")
      } catch (error) {
        console.error("Error deleting service record:", error)
        toast.error("Failed to delete service record")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "maintenance": return "bg-blue-100 text-blue-800"
      case "repair": return "bg-amber-100 text-amber-800"
      case "inspection": return "bg-green-100 text-green-800"
      case "replacement": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={cn("mb-2", getServiceTypeColor(log.service_type))}>
              {log.service_type.charAt(0).toUpperCase() + log.service_type.slice(1)}
            </Badge>
            <CardTitle className="text-base font-medium">
              {format(new Date(log.service_date), "MMMM d, yyyy")}
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-red-500"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm text-gray-700">{log.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
          {log.cost !== null && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Cost:</span> ${log.cost.toFixed(2)}
            </div>
          )}
          
          {log.provider_name && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Provider:</span> {log.provider_name}
            </div>
          )}
        </div>
      </CardContent>
      
      {log.attachment_url && (
        <CardFooter className="px-4 pt-0 pb-3 border-t mt-2">
          <a 
            href={log.attachment_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-[#285755] hover:underline flex items-center gap-1"
          >
            <FileIcon className="h-4 w-4" />
            View Attachment
          </a>
        </CardFooter>
      )}
    </Card>
  )
}

interface AddServiceLogDialogProps {
  applianceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AddServiceLogDialog({ applianceId, open, onOpenChange }: AddServiceLogDialogProps) {
  const createServiceLog = useCreateApplianceServiceLog()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const form = useForm<ServiceLogFormValues>({
    resolver: zodResolver(serviceLogSchema),
    defaultValues: {
      service_date: new Date(),
      description: "",
      cost: "",
      provider_name: "",
    },
  })

  const onSubmit = async (values: ServiceLogFormValues) => {
    try {
      await createServiceLog.mutateAsync({
        applianceId,
        formData: {
          ...values,
          attachment_file: selectedFile || undefined,
        },
      })
      
      toast.success("Service record added successfully")
      form.reset()
      setSelectedFile(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding service record:", error)
      toast.error("Failed to add service record")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Service Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Service Record</DialogTitle>
          <DialogDescription>
            Add a new service or maintenance record for this appliance.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Service Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="service_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service or maintenance performed"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="provider_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Provider (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provider name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="attachment_file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Attachment (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSelectedFile(file)
                            onChange(file)
                          }
                        }}
                        {...fieldProps}
                      />
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFile(null)
                            onChange(null)
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a receipt, invoice, or other documentation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createServiceLog.isPending}
                className="gap-2"
              >
                {createServiceLog.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Record
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
