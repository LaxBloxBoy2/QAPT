'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'

interface PropertyFeaturesSelectorProps {
  title: string
  description: string
  initialFeatures?: string[]
  onFeaturesChange: (features: string[]) => void
  suggestions?: string[]
}

export function PropertyFeaturesSelector({
  title,
  description,
  initialFeatures = [],
  onFeaturesChange,
  suggestions = []
}: PropertyFeaturesSelectorProps) {
  const [features, setFeatures] = useState<string[]>(initialFeatures)
  const [newFeature, setNewFeature] = useState('')

  const addFeature = (feature: string) => {
    const trimmedFeature = feature.trim()
    if (!trimmedFeature) return
    
    // Don't add duplicates
    if (features.includes(trimmedFeature)) return
    
    const updatedFeatures = [...features, trimmedFeature]
    setFeatures(updatedFeatures)
    onFeaturesChange(updatedFeatures)
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    setFeatures(updatedFeatures)
    onFeaturesChange(updatedFeatures)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature(newFeature)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
          >
            <span>{feature}</span>
            <button 
              type="button"
              onClick={() => removeFeature(index)}
              className="ml-2 text-primary/70 hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a custom feature..."
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          type="button" 
          onClick={() => addFeature(newFeature)}
          disabled={!newFeature.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFeature(suggestion)}
                disabled={features.includes(suggestion)}
                className="rounded-full"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
