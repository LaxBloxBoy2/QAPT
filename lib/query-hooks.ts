"use client"

import { useQuery } from '@tanstack/react-query';
import { propertiesService, unitsService, tenantsService, leasesService } from './api-services';
import { useAuthStore } from './auth-store';

// Properties hooks
export function useProperties() {
  const { currentOrganization } = useAuthStore();
  
  return useQuery({
    queryKey: ['properties', currentOrganization?.id],
    queryFn: () => propertiesService.getProperties(currentOrganization?.id || ''),
    enabled: !!currentOrganization?.id,
  });
}

export function useProperty(propertyId: string) {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertiesService.getPropertyById(propertyId),
    enabled: !!propertyId,
  });
}

// Units hooks
export function useUnitsByProperty(propertyId: string) {
  return useQuery({
    queryKey: ['units', propertyId],
    queryFn: () => unitsService.getUnitsByProperty(propertyId),
    enabled: !!propertyId,
  });
}

export function useUnit(unitId: string) {
  return useQuery({
    queryKey: ['unit', unitId],
    queryFn: () => unitsService.getUnitById(unitId),
    enabled: !!unitId,
  });
}

// Tenants hooks
export function useTenants() {
  const { currentOrganization } = useAuthStore();
  
  return useQuery({
    queryKey: ['tenants', currentOrganization?.id],
    queryFn: () => tenantsService.getTenants(currentOrganization?.id || ''),
    enabled: !!currentOrganization?.id,
  });
}

export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantsService.getTenantById(tenantId),
    enabled: !!tenantId,
  });
}

// Leases hooks
export function useLeases() {
  const { currentOrganization } = useAuthStore();
  
  return useQuery({
    queryKey: ['leases', currentOrganization?.id],
    queryFn: () => leasesService.getLeases(currentOrganization?.id || ''),
    enabled: !!currentOrganization?.id,
  });
}

export function useLease(leaseId: string) {
  return useQuery({
    queryKey: ['lease', leaseId],
    queryFn: () => leasesService.getLeaseById(leaseId),
    enabled: !!leaseId,
  });
}
