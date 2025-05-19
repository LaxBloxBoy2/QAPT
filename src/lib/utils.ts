import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatAddress(property: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}) {
  return [
    property.street,
    property.city,
    property.state,
    property.zip,
    property.country
  ].filter(Boolean).join(', ')
}
