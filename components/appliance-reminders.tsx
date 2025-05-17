"use client"

import { useState } from "react"
import { format, addDays, isBefore } from "date-fns"
import {
  AlertCircle,
  Bell,
  CalendarIcon,
  Clock,
  Loader2,
  PlusCircle,
  RefreshCw,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useApplianceReminders, useCreateApplianceReminder, useDeleteApplianceReminder } from "@/lib/hooks/use-appliance-reminders"

// Reminder form schema
const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  all_day: z.boolean().default(true),
  recurring: z.boolean().default(false),
  recurring_pattern: z.enum(["daily", "weekly", "monthly"]).optional(),
  sync_to_google: z.boolean().default(false),
})

type ReminderFormValues = z.infer<typeof reminderSchema>

interface ApplianceRemindersProps {
  applianceId: string
  propertyId: string
}

export function ApplianceReminders({ applianceId, propertyId }: ApplianceRemindersProps) {
  const { data: applianceEvents = [], isLoading, error } = useApplianceReminders(applianceId)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    console.error('Error loading calendar events:', error)
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Could not load reminders</h3>
        <p className="text-gray-500 mt-1 mb-4">
          There was an error loading reminders. The calendar feature may not be set up yet.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Reminder
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Maintenance Reminders</h3>
        <AddReminderDialog
          applianceId={applianceId}
          propertyId={propertyId}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>

      {applianceEvents.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <Bell className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No reminders</h3>
          <p className="text-gray-500 mt-1 mb-4">No maintenance reminders have been set for this appliance.</p>
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applianceEvents.map((event) => (
            <ReminderCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ReminderCardProps {
  event: any // Using any for now since we don't have the exact type
}

function ReminderCard({ event }: ReminderCardProps) {
  const deleteReminder = useDeleteApplianceReminder()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this reminder? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteReminder.mutateAsync(event.id)
        toast.success("Reminder deleted successfully")
      } catch (error) {
        console.error("Error deleting reminder:", error)
        toast.error("Failed to delete reminder")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const isUpcoming = isBefore(new Date(), new Date(event.date))

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={cn(
              "mb-2",
              isUpcoming
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            )}>
              {isUpcoming ? "Upcoming" : "Past Due"}
            </Badge>
            <CardTitle className="text-base font-medium">
              {event.title}
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
        {event.description && (
          <p className="text-sm text-gray-700 mb-3">{event.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
          </div>

          {event.recurring && (
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Repeats {event.recurring_pattern}</span>
            </div>
          )}

          {!event.all_day && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(event.date), "h:mm a")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface AddReminderDialogProps {
  applianceId: string
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AddReminderDialog({ applianceId, propertyId, open, onOpenChange }: AddReminderDialogProps) {
  const createReminder = useCreateApplianceReminder()

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      description: "",
      date: addDays(new Date(), 30), // Default to 30 days from now
      all_day: true,
      recurring: false,
      sync_to_google: false,
    },
  })

  const watchRecurring = form.watch("recurring")

  const onSubmit = async (values: ReminderFormValues) => {
    try {
      await createReminder.mutateAsync({
        applianceId,
        propertyId,
        formData: {
          title: values.title,
          description: values.description || "",
          date: values.date,
          all_day: values.all_day,
          recurring: values.recurring,
          recurring_pattern: values.recurring ? values.recurring_pattern : undefined,
          sync_to_google: values.sync_to_google,
          metadata: {
            type: "appliance_maintenance"
          }
        }
      })

      toast.success("Reminder added successfully")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding reminder:", error)
      toast.error("Failed to add reminder")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Maintenance Reminder</DialogTitle>
          <DialogDescription>
            Set a reminder for maintenance or service for this appliance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Filter replacement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about the maintenance"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                name="all_day"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">All day</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Recurring reminder</FormLabel>
                </FormItem>
              )}
            />

            {watchRecurring && (
              <FormField
                control={form.control}
                name="recurring_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat Pattern</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="sync_to_google"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer flex items-center">
                      <span>Sync to Google Calendar</span>
                      <img
                        src="/google-calendar-icon.png"
                        alt="Google Calendar"
                        className="h-4 w-4 ml-2"
                      />
                    </FormLabel>
                    <FormDescription>
                      Add this reminder to your Google Calendar
                    </FormDescription>
                  </div>
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
                disabled={createReminder.isPending}
                className="gap-2"
              >
                {createReminder.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Reminder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
