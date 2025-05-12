// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Configuration
const STALE_THRESHOLD_DAYS = 7;
const MAX_NOTIFICATIONS_PER_RUN = 100;

// Create a Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

// Create a notification
async function createNotification(supabase, { organizationId, userId = null, title, body, type, link = null }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      title,
      body,
      type,
      link,
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
}

// Format date for display
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate days between two dates
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
}

// Log function execution
function logExecution(functionName, result) {
  console.log(`[${new Date().toISOString()}] ${functionName} executed:`, result);
}

serve(async (req) => {
  try {
    // Create Supabase client
    const supabase = createSupabaseClient();

    // Get current date
    const today = new Date();

    // Calculate the threshold date
    const thresholdDate = new Date(today);
    thresholdDate.setDate(today.getDate() - STALE_THRESHOLD_DAYS);

    // Format date for Supabase query
    const thresholdDateStr = thresholdDate.toISOString();

    console.log(`Checking for maintenance requests with no updates since ${thresholdDateStr}`);

    // Get all open or in-progress maintenance requests
    const { data: requests, error } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        title,
        status,
        priority,
        created_at,
        updated_at,
        organization_id,
        property_id,
        unit_id,
        assigned_to,
        property:properties(name),
        unit:units(unit_number),
        assignee:user_profiles!maintenance_requests_assigned_to_fkey(id, user_id)
      `)
      .in('status', ['open', 'in_progress'])
      .lt('updated_at', thresholdDateStr);

    if (error) {
      throw error;
    }

    console.log(`Found ${requests.length} stale maintenance requests`);

    // Process each request and create notifications
    const notificationsCreated = [];

    for (const request of requests) {
      // Limit the number of notifications created
      if (notificationsCreated.length >= MAX_NOTIFICATIONS_PER_RUN) {
        console.log(`Reached maximum number of notifications (${MAX_NOTIFICATIONS_PER_RUN}). Stopping.`);
        break;
      }

      const organizationId = request.organization_id;
      const requestTitle = request.title;
      const requestStatus = request.status;
      const requestPriority = request.priority;
      const propertyName = request.property?.name || 'Unknown Property';
      const unitNumber = request.unit?.unit_number || 'N/A';
      const updatedAt = new Date(request.updated_at);
      const daysSinceUpdate = daysBetween(today, updatedAt);

      // Create notification for the assignee if assigned
      if (request.assigned_to && request.assignee) {
        const userId = request.assignee.user_id;

        const notification = await createNotification(supabase, {
          organizationId,
          userId,
          title: `Stale Maintenance Request: ${requestTitle}`,
          body: `This ${requestPriority} priority request for ${propertyName} ${unitNumber ? `(Unit ${unitNumber})` : ''} has been in "${requestStatus}" status for ${daysSinceUpdate} days with no updates.`,
          type: 'maintenance',
          link: `/maintenance/${request.id}`
        });

        notificationsCreated.push(notification);
      } else {
        // If not assigned, create an organization-wide notification
        const notification = await createNotification(supabase, {
          organizationId,
          title: `Unassigned Stale Maintenance Request: ${requestTitle}`,
          body: `This ${requestPriority} priority request for ${propertyName} ${unitNumber ? `(Unit ${unitNumber})` : ''} has been in "${requestStatus}" status for ${daysSinceUpdate} days with no updates and is not assigned to anyone.`,
          type: 'maintenance',
          link: `/maintenance/${request.id}`
        });

        notificationsCreated.push(notification);
      }
    }

    // Log the execution
    logExecution('check-stale-maintenance', {
      requestsChecked: requests.length,
      notificationsCreated: notificationsCreated.length
    });

    return new Response(
      JSON.stringify({
        success: true,
        requestsChecked: requests.length,
        notificationsCreated: notificationsCreated.length
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in check-stale-maintenance function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});
