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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search properties by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 h-12 rounded-full border-gray-300 dark:border-gray-600 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 h-12 rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Filter className="h-5 w-5" />
          Filters
          {showFilters ? (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {Object.values(filters).filter(Boolean).length}
            </span>
          ) : null}
        </Button>
        <Button
          onClick={handleSearch}
          className="h-12 rounded-full px-6"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg">Filter Properties</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Property Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger className="h-10 rounded-md border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="single">Single Unit</SelectItem>
                  <SelectItem value="multi">Multi Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Occupancy %</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="100"
                    value={filters.occupancyMin || ''}
                    onChange={(e) => handleFilterChange('occupancyMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-10 rounded-md border-gray-300 dark:border-gray-600 pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="100"
                    value={filters.occupancyMax || ''}
                    onChange={(e) => handleFilterChange('occupancyMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-10 rounded-md border-gray-300 dark:border-gray-600 pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Balance (€)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={filters.balanceMin || ''}
                    onChange={(e) => handleFilterChange('balanceMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-10 rounded-md border-gray-300 dark:border-gray-600 pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                </div>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={filters.balanceMax || ''}
                    onChange={(e) => handleFilterChange('balanceMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-10 rounded-md border-gray-300 dark:border-gray-600 pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full h-10 rounded-md"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
