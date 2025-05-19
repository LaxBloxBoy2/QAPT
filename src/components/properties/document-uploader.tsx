'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, X, Upload, File } from 'lucide-react'

interface DocumentUploaderProps {
  initialDocuments?: string[]
  onDocumentsChange: (documents: string[]) => void
  maxDocuments?: number
}

export function DocumentUploader({
  initialDocuments = [],
  onDocumentsChange,
  maxDocuments = 10
}: DocumentUploaderProps) {
  const [documents, setDocuments] = useState<Array<{ name: string, url: string }>>(
    initialDocuments.map(url => ({ 
      name: url.split('/').pop() || 'Document', 
      url 
    }))
  )
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (documents.length + files.length > maxDocuments) {
      setError(`You can only upload a maximum of ${maxDocuments} documents`)
      return
    }

    setIsUploading(true)
    setError(null)

    // In a real implementation, you would upload these to Supabase Storage
    // For now, we'll just create local URLs
    const newDocuments = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
    
    const updatedDocuments = [...documents, ...newDocuments]
    setDocuments(updatedDocuments)
    onDocumentsChange(updatedDocuments.map(doc => doc.url))
    setIsUploading(false)
    
    // Reset the input
    e.target.value = ''
  }, [documents, maxDocuments, onDocumentsChange])

  const removeDocument = useCallback((index: number) => {
    const updatedDocuments = [...documents]
    updatedDocuments.splice(index, 1)
    setDocuments(updatedDocuments)
    onDocumentsChange(updatedDocuments.map(doc => doc.url))
  }, [documents, onDocumentsChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Property Documents</h3>
        <p className="text-xs text-gray-500">{documents.length}/{maxDocuments} documents</p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => removeDocument(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {documents.length < maxDocuments && (
          <Card className="border-dashed">
            <CardContent className="p-0">
              <label className="flex items-center justify-center p-4 cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="flex items-center text-gray-400">
                    <Upload className="h-5 w-5 mr-2 animate-pulse" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400">
                    <File className="h-5 w-5 mr-2" />
                    <span className="text-sm">Upload Documents</span>
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
