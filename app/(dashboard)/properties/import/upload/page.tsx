"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, CheckCircle2, X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { useCreateImportSession } from "@/lib/hooks/use-imports"
import { createClient as createClientBrowser } from '@supabase/supabase-js'

export default function UploadStep() {
  const router = useRouter()
  const { toast } = useToast()
  const { profile } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createImportSession = useCreateImportSession()

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
        variant: "destructive"
      })
      return
    }

    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleContinue = async () => {
    if (!file) {
      toast({
        title: "Upload failed",
        description: "Please select a file first.",
        variant: "destructive"
      })
      return
    }

    try {
      console.log("Starting direct upload process for file:", file.name)

      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append('file', file)

      // Use the server-side API endpoint to upload the file and create a session
      const response = await fetch('/api/imports/direct-upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error from direct upload API:", errorData)
        throw new Error(errorData.error || 'Failed to upload file')
      }

      const result = await response.json()
      console.log("Direct upload successful:", result)

      // Store the headers and session info in localStorage
      localStorage.setItem('import_headers', JSON.stringify(result.headers || []))
      localStorage.setItem('import_session_id', result.sessionId)
      localStorage.setItem('import_row_count', String(result.rowCount || 0))

      // Navigate to the next step with the session ID
      router.push(`/properties/import/mapping?sessionId=${result.sessionId}`)
    } catch (error) {
      console.error("Error in upload process:", error)

      let errorMessage = "There was an error uploading your file. Please try again."

      if (error instanceof Error) {
        errorMessage = `Upload failed: ${error.message}`
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-xl w-full flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">Upload a file</h1>
        <p className="text-gray-600 mb-8">
          You can upload up to 500 rows per import. Supported file formats: .csv, .xls, .xlsx
        </p>

        <Card className="mb-8 w-full">
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-[#285755] bg-[#285755]/5" : "border-gray-200"
              } ${file ? "bg-gray-50" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[#285755]/10 p-2 rounded-full mr-3">
                    <FileText className="h-6 w-6 text-[#285755]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="mb-4 flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Upload className="h-8 w-8 text-[#285755]" />
                  </div>
                </div>
                <p className="text-lg font-medium mb-1">No attachment yet</p>
                <p className="text-gray-500 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Browse files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xls,.xlsx"
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          onClick={() => router.push("/properties/import/template")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!file}
          className={`gap-2 ${
            file ? "bg-[#285755] hover:bg-[#285755]/90" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      </div>
    </div>
  )
}
