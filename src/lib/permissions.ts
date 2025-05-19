import { createClient } from '@/lib/supabase/server'
import { CustomRole, RoleAssignment } from '@/types/database.types'

// Define permission types
export type Permission =
  | 'view_properties'
  | 'edit_properties'
  | 'view_tenants'
  | 'edit_tenants'
  | 'view_leases'
  | 'edit_leases'
  | 'view_payments'
  | 'edit_payments'
  | 'view_reports'
  | 'manage_team'

// Default permissions for built-in roles
const DEFAULT_PERMISSIONS: Record<string, Record<Permission, boolean>> = {
  owner: {
    view_properties: true,
    edit_properties: true,
    view_tenants: true,
    edit_tenants: true,
    view_leases: true,
    edit_leases: true,
    view_payments: true,
    edit_payments: true,
    view_reports: true,
    manage_team: true,
  },
  team_member: {
    view_properties: true,
    edit_properties: false,
    view_tenants: true,
    edit_tenants: true,
    view_leases: true,
    edit_leases: true,
    view_payments: true,
    edit_payments: true,
    view_reports: true,
    manage_team: false,
  },
}

// Define types for Supabase query results
type RoleAssignmentWithJoins = {
  role_id: string | null;
  custom_role_id: string | null;
  roles: { name: string } | null;
  custom_roles: { name: string; permissions: Record<string, boolean> } | null;
}

// Get user's role for a specific property
export async function getUserRoleForProperty(userId: string, propertyId: string) {
  const supabase = await createClient()

  const { data: roleAssignment, error } = await supabase
    .from('role_assignments')
    .select(`
      role_id,
      custom_role_id,
      roles:role_id(name),
      custom_roles:custom_role_id(name, permissions)
    `)
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single() as { data: RoleAssignmentWithJoins | null; error: any }

  if (error || !roleAssignment) {
    return null
  }

  if (roleAssignment.role_id) {
    const roleName = roleAssignment.roles?.name || '';
    return {
      type: 'built-in',
      name: roleName,
      permissions: DEFAULT_PERMISSIONS[roleName] || {},
    }
  }

  if (roleAssignment.custom_role_id) {
    return {
      type: 'custom',
      name: roleAssignment.custom_roles?.name || '',
      permissions: roleAssignment.custom_roles?.permissions || {},
    }
  }

  return null
}

// Check if user has a specific permission for a property
export async function hasPermission(
  userId: string,
  propertyId: string,
  permission: Permission
): Promise<boolean> {
  const role = await getUserRoleForProperty(userId, propertyId)

  if (!role) {
    return false
  }

  return !!role.permissions[permission]
}

// Check if user is the owner of a property
export async function isPropertyOwner(userId: string, propertyId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', propertyId)
    .eq('owner_id', userId)
    .single()

  return !error && !!data
}
