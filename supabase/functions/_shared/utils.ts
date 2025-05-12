  import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

  // Create a Supabase client
  export const createSupabaseClient = () => {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey);
  };

  // Create a notification
  export async function createNotification(
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
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Calculate days between two dates
  export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
  }

  // Get organization managers and admins
  export async function getOrganizationAdmins(supabase: any, organizationId: string) {
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
  export function logExecution(functionName: string, result: any) {
    console.log(`[${new Date().toISOString()}] ${functionName} executed:`, result);
  }
