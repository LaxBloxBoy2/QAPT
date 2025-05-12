// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Configuration
const LEASE_EXPIRY_THRESHOLDS = [15, 30];
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
async function createNotification(
  supabase: any,
  {
    organizationId,
    userId = null,
    title,
    body,
    type,
    link = null,
  }: {
    organizationId: string;
    userId?: string | null;
    title: string;
    body: string;
    type: 'lease' | 'finance' | 'maintenance' | 'system';
    link?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      title,
      body,
      type,
      link,
      is_read: false,
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
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Calculate days between two dates
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
}

// Get organization managers and admins
async function getOrganizationAdmins(supabase: any, organizationId: string) {
  const { data, error } = await supabase
    .from('user_organizations')
    .select('user_id')
    .eq('organization_id', organizationId)
    .in('role', ['admin', 'manager']);

  if (error) {
    console.error('Error fetching organization admins:', error);
    throw error;
  }

  return data.map((item: any) => item.user_id);
}

// Log function execution
function logExecution(functionName: string, result: any) {
  console.log(`[${new Date().toISOString()}] ${functionName} executed:`, result);
}

serve(async (req) => {
  try {
    // Create Supabase client
    const supabase = createSupabaseClient();

    // Get current date
    const today = new Date();

    // Calculate the date range for checking lease expiry
    const maxDays = Math.max(...LEASE_EXPIRY_THRESHOLDS);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + maxDays);

    // Format dates for Supabase query
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];

    console.log(`Checking for leases expiring between ${todayStr} and ${futureDateStr}`);

    // Get all active leases that will expire within the threshold period
    const { data: leases, error } = await supabase
      .from('leases')
      .select(`
        id,
        start_date,
        end_date,
        status,
        unit_id,
        tenant_id,
        unit:units(
          unit_number,
          property_id,
          property:properties(
            name,
            organization_id
          )
        ),
        tenant:tenants(
          first_name,
          last_name
        )
      `)
      .eq('status', 'active')
      .gte('end_date', todayStr)
      .lte('end_date', futureDateStr);

    if (error) {
      throw error;
    }

    console.log(`Found ${leases.length} leases expiring soon`);

    // Process each lease and create notifications
    const notificationsCreated = [];

      for (const lease of leases) {
        const endDate = new Date(lease.end_date);
        const daysUntilExpiry = daysBetween(today, endDate);

        // Only create notifications for specific thresholds
        if (!LEASE_EXPIRY_THRESHOLDS.includes(daysUntilExpiry)) {
          continue;
        }

        // Limit the number of notifications created
        if (notificationsCreated.length >= MAX_NOTIFICATIONS_PER_RUN) {
          console.log(`Reached maximum number of notifications (${MAX_NOTIFICATIONS_PER_RUN}). Stopping.`);
          break;
        }

        const organizationId = lease.unit.property.organization_id;
        const propertyName = lease.unit.property.name;
        const unitNumber = lease.unit.unit_number;
        const tenantName = `${lease.tenant.first_name} ${lease.tenant.last_name}`;
        const expiryDate = formatDate(endDate);

        // Create notification for organization admins and managers
        const adminUserIds = await getOrganizationAdmins(supabase, organizationId);

        for (const userId of adminUserIds) {
          const notification = await createNotification(supabase, {
            organizationId,
            userId,
            title: `Lease Expiring in ${daysUntilExpiry} Days`,
            body: `The lease for ${tenantName} in unit ${unitNumber} at ${propertyName} will expire on ${expiryDate}.`,
            type: 'lease',
            link: `/leases/${lease.id}`,
          });

          notificationsCreated.push(notification);
        }
      }

      // Log the execution
      logExecution('check-lease-expiry', {
        leasesChecked: leases.length,
        notificationsCreated: notificationsCreated.length,
      });

      return new Response(
        JSON.stringify({
          success: true,
          leasesChecked: leases.length,
          notificationsCreated: notificationsCreated.length,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error('Error in check-lease-expiry function:', error);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  });
