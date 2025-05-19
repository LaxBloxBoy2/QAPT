// Mock data for development purposes
import { Property } from '@/types/database.types'

export const mockProperties: Property[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    owner_id: 'user-1',
    name: 'Sunset Apartments',
    street: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    country: 'USA',
    type: 'multi',
    beds: 24,
    baths: 24,
    size_sqft: 12000,
    year_built: 1985,
    market_rent: 2500,
    deposit: 2500,
    manufactured: false,
    mls_number: 'MLS123456',
    occupancy_percentage: 85,
    balance: 12500,
    amenities: ['pool', 'gym', 'parking'],
    features: ['hardwood', 'granite', 'stainless'],
    images: ['/placeholder-property.jpg'],
    attachments: []
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    owner_id: 'user-1',
    name: 'Ocean View Condo',
    street: '456 Beach Drive',
    city: 'Miami',
    state: 'FL',
    zip: '33139',
    country: 'USA',
    type: 'single',
    beds: 2,
    baths: 2,
    size_sqft: 1200,
    year_built: 2010,
    market_rent: 3200,
    deposit: 3200,
    manufactured: false,
    mls_number: 'MLS789012',
    occupancy_percentage: 100,
    balance: 3200,
    amenities: ['beach access', 'pool', 'security'],
    features: ['balcony', 'ocean view', 'modern kitchen'],
    images: ['/placeholder-property.jpg'],
    attachments: []
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    owner_id: 'user-1',
    name: 'Downtown Loft',
    street: '789 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    type: 'single',
    beds: 1,
    baths: 1,
    size_sqft: 950,
    year_built: 1920,
    market_rent: 4000,
    deposit: 4000,
    manufactured: false,
    mls_number: 'MLS345678',
    occupancy_percentage: 0,
    balance: 0,
    amenities: ['doorman', 'elevator', 'roof deck'],
    features: ['exposed brick', 'high ceilings', 'large windows'],
    images: ['/placeholder-property.jpg'],
    attachments: []
  }
]

export const mockUser = {
  id: 'user-1',
  email: 'demo@qapt.com',
  user_metadata: {
    name: 'Demo User'
  }
}

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Function to get mock properties with optional delay
export async function getMockProperties(delayMs = 500): Promise<Property[]> {
  await delay(delayMs)
  return [...mockProperties]
}

// Function to get a single mock property
export async function getMockProperty(id: string, delayMs = 500): Promise<Property | undefined> {
  await delay(delayMs)
  return mockProperties.find(property => property.id === id)
}
