'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Home, Building2 } from 'lucide-react'

interface PropertyTypeSelectorProps {
  initialValue?: 'single' | 'multi'
  onValueChange: (value: 'single' | 'multi') => void
}

export function PropertyTypeSelector({
  initialValue = 'single',
  onValueChange
}: PropertyTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'single' | 'multi'>(initialValue)

  const handleSelect = (type: 'single' | 'multi') => {
    setSelectedType(type)
    onValueChange(type)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Property Type</h3>
        <p className="text-sm text-gray-500">Select the type of property you're adding</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            selectedType === 'single' 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => handleSelect('single')}
        >
          <CardContent className="p-6 flex items-start space-x-4">
            <div className={`rounded-full p-2 ${
              selectedType === 'single' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
            }`}>
              <Home className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Single Unit</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    A standalone property with one unit (house, condo, etc.)
                  </p>
                </div>
                {selectedType === 'single' && (
                  <div className="rounded-full bg-primary text-white p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selectedType === 'multi' 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => handleSelect('multi')}
        >
          <CardContent className="p-6 flex items-start space-x-4">
            <div className={`rounded-full p-2 ${
              selectedType === 'multi' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
            }`}>
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Multi Unit</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    A property with multiple units (apartment building, duplex, etc.)
                  </p>
                </div>
                {selectedType === 'multi' && (
                  <div className="rounded-full bg-primary text-white p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
