'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'

// Get all payments for a lease
export async function getPaymentsForLease(leaseId: string) {
  const supabase = createClient()
  
  // Get the lease to check property ID
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id')
    .eq('id', leaseId)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check if user has permission to view payments
  const canView = await hasPermission(user.id, lease.property_id, 'view_payments')
  if (!canView) {
    throw new Error('Not authorized to view payments for this lease')
  }
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('lease_id', leaseId)
    .order('date_paid', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Get all payments for a property
export async function getPaymentsForProperty(propertyId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check if user has permission to view payments
  const canView = await hasPermission(user.id, propertyId, 'view_payments')
  if (!canView) {
    throw new Error('Not authorized to view payments for this property')
  }
  
  const { data, error } = await supabase
    .from('payments')
    .select('*, leases!inner(*, tenants(*))')
    .eq('leases.property_id', propertyId)
    .order('date_paid', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Get a single payment by ID
export async function getPayment(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select('*, leases!inner(*, tenants(*), properties(*))')
    .eq('id', id)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  // Check if user has permission to view this payment
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const canView = await hasPermission(user.id, data.leases.property_id, 'view_payments')
  if (!canView) {
    throw new Error('Not authorized to view this payment')
  }
  
  return data
}

// Create a new payment
export async function createPayment(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const leaseId = formData.get('leaseId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const datePaid = formData.get('datePaid') as string
  const status = formData.get('status') as string
  
  if (!leaseId || isNaN(amount) || !datePaid || !status) {
    throw new Error('All fields are required')
  }
  
  // Get the lease to check property ID
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id')
    .eq('id', leaseId)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  // Check if user has permission to edit payments
  const canEdit = await hasPermission(user.id, lease.property_id, 'edit_payments')
  if (!canEdit) {
    throw new Error('Not authorized to add payments for this lease')
  }
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      lease_id: leaseId,
      amount,
      date_paid: datePaid,
      status,
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath(`/dashboard/leases/${leaseId}/payments`)
  revalidatePath(`/dashboard/properties/${lease.property_id}/payments`)
  redirect(`/dashboard/leases/${leaseId}/payments`)
}

// Update a payment
export async function updatePayment(id: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Get the payment and lease to check property ID
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('lease_id')
    .eq('id', id)
    .single()
  
  if (paymentError || !payment) {
    throw new Error('Payment not found')
  }
  
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id')
    .eq('id', payment.lease_id)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  // Check if user has permission to edit payments
  const canEdit = await hasPermission(user.id, lease.property_id, 'edit_payments')
  if (!canEdit) {
    throw new Error('Not authorized to edit payments for this lease')
  }
  
  const amount = parseFloat(formData.get('amount') as string)
  const datePaid = formData.get('datePaid') as string
  const status = formData.get('status') as string
  
  if (isNaN(amount) || !datePaid || !status) {
    throw new Error('All fields are required')
  }
  
  const { error } = await supabase
    .from('payments')
    .update({
      amount,
      date_paid: datePaid,
      status,
    })
    .eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath(`/dashboard/payments/${id}`)
  revalidatePath(`/dashboard/leases/${payment.lease_id}/payments`)
  revalidatePath(`/dashboard/properties/${lease.property_id}/payments`)
  redirect(`/dashboard/leases/${payment.lease_id}/payments`)
}

// Delete a payment
export async function deletePayment(id: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Get the payment and lease to check property ID
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('lease_id')
    .eq('id', id)
    .single()
  
  if (paymentError || !payment) {
    throw new Error('Payment not found')
  }
  
  const { data: lease, error: leaseError } = await supabase
    .from('leases')
    .select('property_id')
    .eq('id', payment.lease_id)
    .single()
  
  if (leaseError || !lease) {
    throw new Error('Lease not found')
  }
  
  // Check if user has permission to edit payments
  const canEdit = await hasPermission(user.id, lease.property_id, 'edit_payments')
  if (!canEdit) {
    throw new Error('Not authorized to delete payments for this lease')
  }
  
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath(`/dashboard/leases/${payment.lease_id}/payments`)
  revalidatePath(`/dashboard/properties/${lease.property_id}/payments`)
  redirect(`/dashboard/leases/${payment.lease_id}/payments`)
}
