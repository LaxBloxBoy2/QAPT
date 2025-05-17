"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/user-context'

// Type for calendar events
export type CalendarEvent = {
  id: string
  title: string
  description: string | null
  event_type: 'reminder' | 'maintenance' | 'rent_notice' | 'general'
  date: string
  all_day: boolean
  recurring: boolean
  recurring_pattern: 'daily' | 'weekly' | 'monthly' | null
  assignee_id: string | null
  property_id: string | null
  unit_id: string | null
  organization_id: string
  created_by: string
  created_at: string
  metadata: string | null
  sync_to_google: boolean
  google_event_id: string | null
}

// Type for reminder form data
export type ReminderFormData = {
  title: string
  description?: string
  date: Date
  all_day: boolean
  recurring: boolean
  recurring_pattern?: 'daily' | 'weekly' | 'monthly'
  property_id?: string
  metadata?: Record<string, any>
  sync_to_google?: boolean
}

// Hook to fetch reminders for a specific appliance
export function useApplianceReminders(applianceId?: string) {
  const { profile } = useUser()
  const organizationId = profile?.organization_id

  return useQuery({
    queryKey: ['appliance-reminders', applianceId],
    queryFn: async (): Promise<CalendarEvent[]> => {
      if (!applianceId || !organizationId) return []

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('event_type', 'reminder')
        .order('date', { ascending: true })

      if (error) throw error

      // Filter events related to this appliance
      return (data || []).filter(event => {
        if (!event.metadata) return false

        try {
          const metadata = typeof event.metadata === 'string'
            ? JSON.parse(event.metadata)
            : event.metadata

          return metadata?.appliance_id === applianceId
        } catch (e) {
          console.error('Error parsing event metadata:', e)
          return false
        }
      })
    },
    enabled: !!applianceId && !!organizationId
  })
}

// Hook to create a reminder for an appliance
export function useCreateApplianceReminder() {
  const queryClient = useQueryClient()
  const { profile } = useUser()

  return useMutation({
    mutationFn: async ({ 
      applianceId, 
      propertyId, 
      formData 
    }: { 
      applianceId: string
      propertyId?: string
      formData: ReminderFormData
    }): Promise<CalendarEvent> => {
      if (!profile?.organization_id) {
        throw new Error('No organization ID found')
      }

      // Prepare metadata
      const metadata = {
        appliance_id: applianceId,
        type: "appliance_maintenance",
        ...formData.metadata
      }

      // Insert the event
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: formData.title,
          description: formData.description || null,
          event_type: 'reminder',
          date: formData.date.toISOString(),
          all_day: formData.all_day,
          recurring: formData.recurring,
          recurring_pattern: formData.recurring ? formData.recurring_pattern : null,
          property_id: propertyId || null,
          organization_id: profile.organization_id,
          created_by: profile.id,
          metadata: JSON.stringify(metadata),
          sync_to_google: formData.sync_to_google || false
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appliance-reminders'] })
    }
  })
}

// Hook to delete a reminder
export function useDeleteApplianceReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliance-reminders'] })
    }
  })
}
