// Configuration for notification edge functions

// Lease expiry notification thresholds (in days)
export const LEASE_EXPIRY_THRESHOLDS = [15, 30];

// Days after the 1st of the month to check for unpaid rent
export const DAYS_AFTER_DUE_DATE = 5;

// Days of inactivity to consider a maintenance request stale
export const STALE_THRESHOLD_DAYS = 7;

// Maximum number of notifications to create per function run
export const MAX_NOTIFICATIONS_PER_RUN = 100;
