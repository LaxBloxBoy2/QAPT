'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'

interface PropertyFiltersProps {
  onSearch: (query: string) => void
  onFilter: (filters: PropertyFilters) => void
}

export interface PropertyFilters {
  type?: 'single' | 'multi' | ''
  occupancyMin?: number
  occupancyMax?: number
  balanceMin?: number
  balanceMax?: number
}

export function PropertyFilters({ onSearch, onFilter }: PropertyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({
    type: '' as const,
    occupancyMin: undefined,
    occupancyMax: undefined,
    balanceMin: undefined,
    balanceMax: undefined
  })

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: PropertyFilters = {
      type: '',
      occupancyMin: undefined,
      occupancyMax: undefined,
      balanceMin: undefined,
      balanceMax: undefined
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Property Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="single">Single Unit</SelectItem>
                  <SelectItem value="multi">Multi Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Occupancy %</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.occupancyMin || ''}
                  onChange={(e) => handleFilterChange('occupancyMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.occupancyMax || ''}
                  onChange={(e) => handleFilterChange('occupancyMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Balance (€)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filters.balanceMin || ''}
                  onChange={(e) => handleFilterChange('balanceMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filters.balanceMax || ''}
                  onChange={(e) => handleFilterChange('balanceMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
