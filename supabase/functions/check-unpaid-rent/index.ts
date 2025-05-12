// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Configuration
const DAYS_AFTER_DUE_DATE = 5;
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
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Calculate the rent due date (1st of the current month)
    const dueDate = new Date(currentYear, currentMonth, 1);

    // Only check for unpaid rent if we're past the grace period
    const dayOfMonth = today.getDate();
    if (dayOfMonth <= DAYS_AFTER_DUE_DATE) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Still within grace period (${DAYS_AFTER_DUE_DATE} days). No checks performed.`,
          checksPerformed: 0,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Format dates for Supabase query
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

    console.log(`Checking for unpaid rent for period: ${firstDayOfMonth} to ${lastDayOfMonth}`);

    // Get all active leases
    const { data: activeLeases, error: leaseError } = await supabase
      .from('leases')
      .select(`
        id,
        rent,
        unit_id,
        tenant_id,
        unit:units(
          unit_number,
          property_id,
          property:properties(
            id,
            name,
            organization_id
          )
        ),
        tenant:tenants(
          first_name,
          last_name
        )
      `)
      .eq('status', 'active');

    if (leaseError) {
      throw leaseError;
    }

    console.log(`Found ${activeLeases.length} active leases`);

    // Process each lease and check for rent payments
    const notificationsCreated = [];

    for (const lease of activeLeases) {
      const propertyId = lease.unit.property.id;

      // Check if there's a rent payment for this lease in the current month
      const { data: payments, error: paymentError } = await supabase
        .from('transactions')
        .select('*')
        .eq('property_id', propertyId)
        .eq('lease_id', lease.id)
        .eq('type', 'income')
        .eq('category', 'Rent')
        .gte('date', firstDayOfMonth)
        .lte('date', lastDayOfMonth);

      if (paymentError) {
        console.error(`Error checking payments for lease ${lease.id}:`, paymentError);
        continue;
      }

      // If no payments found, create a notification
      if (!payments || payments.length === 0) {
        // Limit the number of notifications created
        if (notificationsCreated.length >= MAX_NOTIFICATIONS_PER_RUN) {
          console.log(`Reached maximum number of notifications (${MAX_NOTIFICATIONS_PER_RUN}). Stopping.`);
          break;
        }

        const organizationId = lease.unit.property.organization_id;
        const propertyName = lease.unit.property.name;
        const unitNumber = lease.unit.unit_number;
        const tenantName = `${lease.tenant.first_name} ${lease.tenant.last_name}`;
        const rentAmount = lease.rent;

        // Create notification for organization admins and managers
        const adminUserIds = await getOrganizationAdmins(supabase, organizationId);

        for (const userId of adminUserIds) {
          const notification = await createNotification(supabase, {
            organizationId,
            userId,
            title: `Unpaid Rent: ${propertyName} - Unit ${unitNumber}`,
            body: `Rent payment of $${rentAmount} for ${tenantName} is overdue for ${formatDate(dueDate)}.`,
            type: 'finance',
            link: `/leases/${lease.id}`,
          });

          notificationsCreated.push(notification);
        }
      }
    }

    // Log the execution
    logExecution('check-unpaid-rent', {
      leasesChecked: activeLeases.length,
      notificationsCreated: notificationsCreated.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        leasesChecked: activeLeases.length,
        notificationsCreated: notificationsCreated.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in check-unpaid-rent function:', error);

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
