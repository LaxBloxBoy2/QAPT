import { supabase } from './supabase';
import { Tables } from './supabase';

// Properties Service
export const propertiesService = {
  // Get all properties for the current organization
  getProperties: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    
    if (error) throw error;
    return data as Tables<'properties'>[];
  },

  // Get a single property by ID
  getPropertyById: async (propertyId: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) throw error;
    return data as Tables<'properties'>;
  }
};

// Units Service
export const unitsService = {
  // Get all units for a property
  getUnitsByProperty: async (propertyId: string) => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('property_id', propertyId)
      .order('unit_number');
    
    if (error) throw error;
    return data as Tables<'units'>[];
  },

  // Get a single unit by ID
  getUnitById: async (unitId: string) => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', unitId)
      .single();
    
    if (error) throw error;
    return data as Tables<'units'>;
  }
};

// Tenants Service
export const tenantsService = {
  // Get all tenants for the current organization
  getTenants: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('organization_id', organizationId)
      .order('last_name');
    
    if (error) throw error;
    return data as Tables<'tenants'>[];
  },

  // Get a single tenant by ID
  getTenantById: async (tenantId: string) => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();
    
    if (error) throw error;
    return data as Tables<'tenants'>;
  }
};

// Leases Service
export const leasesService = {
  // Get all leases with related data
  getLeases: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          property_id,
          properties (
            id,
            name
          )
        ),
        tenants (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    
    // Filter leases based on organization_id from the tenant
    const filteredLeases = data.filter(lease => 
      lease.tenants.organization_id === organizationId
    );
    
    return filteredLeases;
  },

  // Get a single lease by ID
  getLeaseById: async (leaseId: string) => {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          property_id,
          properties (
            id,
            name
          )
        ),
        tenants (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', leaseId)
      .single();
    
    if (error) throw error;
    return data;
  }
};
