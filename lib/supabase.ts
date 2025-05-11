import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          organization_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          organization_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          organization_id?: string
          created_at?: string
        }
      }
      units: {
        Row: {
          id: string
          unit_number: string
          property_id: string
          rent_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          unit_number: string
          property_id: string
          rent_amount: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          unit_number?: string
          property_id?: string
          rent_amount?: number
          status?: string
          created_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          organization_id: string
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          organization_id: string
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          organization_id?: string
          created_at?: string
        }
      }
      leases: {
        Row: {
          id: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          tenant_id?: string
          start_date?: string
          end_date?: string
          rent_amount?: number
          status?: string
          created_at?: string
        }
      }
      user_organizations: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
