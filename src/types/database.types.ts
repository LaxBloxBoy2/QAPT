export type User = {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export type Role = {
  id: string
  name: string
  is_custom: boolean
}

export type CustomRole = {
  id: string
  owner_id: string
  name: string
  permissions: Record<string, boolean>
}

export type Property = {
  id: string
  owner_id: string
  title: string
  address: string
  unit_count: number
  created_at: string
}

export type RoleAssignment = {
  id: string
  user_id: string
  property_id: string
  role_id: string | null
  custom_role_id: string | null
}

export type Tenant = {
  id: string
  property_id: string
  full_name: string
  email: string | null
  phone: string | null
  lease_id: string | null
}

export type Lease = {
  id: string
  property_id: string
  tenant_id: string
  start_date: string
  end_date: string
  rent_amount: number
}

export type Payment = {
  id: string
  lease_id: string
  amount: number
  date_paid: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
}
