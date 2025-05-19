'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, ImagePlus } from 'lucide-react'

interface PropertyUploaderProps {
  initialImages?: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function PropertyUploader({ 
  initialImages = [], 
  onImagesChange,
  maxImages = 10
}: PropertyUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`)
      return
    }

    setIsUploading(true)
    setError(null)

    // In a real implementation, you would upload these to Supabase Storage
    // For now, we'll just create local URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file))
    
    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)
    onImagesChange(updatedImages)
    setIsUploading(false)
    
    // Reset the input
    e.target.value = ''
  }, [images, maxImages, onImagesChange])

  const removeImage = useCallback((index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }, [images, onImagesChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Property Photos</h3>
        <p className="text-xs text-gray-500">{images.length}/{maxImages} images</p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative h-32 w-full">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card className="border-dashed">
            <CardContent className="p-0">
              <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload className="h-8 w-8 mb-2 animate-pulse" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImagePlus className="h-8 w-8 mb-2" />
                    <span className="text-xs">Add Photos</span>
                  </div>
                )}
              </label>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
