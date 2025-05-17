"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useImportSession, useUpdateFieldMapping } from "@/lib/hooks/use-imports"

// Required fields for property import
const REQUIRED_FIELDS = [
  { key: "name", label: "Property name" },
  { key: "address", label: "Street" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "ZIP" },
  { key: "property_type", label: "Property type" }
]

// Optional fields for property import
const OPTIONAL_FIELDS = [
  { key: "description", label: "Description" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "unit_size", label: "Size (sq ft)" },
  { key: "rent", label: "Rent" }
]

export default function MappingStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const sessionId = searchParams.get("sessionId")

  const { data: session, isLoading, error } = useImportSession(sessionId)
  const updateFieldMapping = useUpdateFieldMapping()

  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [importFirstRow, setImportFirstRow] = useState(false)
  const [fileHeaders, setFileHeaders] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Get headers from localStorage
    try {
      const storedHeaders = localStorage.getItem('import_headers')
      if (storedHeaders) {
        const headers = JSON.parse(storedHeaders)
        setFileHeaders(headers)

        // Auto-map fields if headers match
        const initialMapping: Record<string, string> = {}
        REQUIRED_FIELDS.concat(OPTIONAL_FIELDS).forEach(field => {
          // Try to find an exact match
          const exactMatch = headers.find(
            (header: string) => header.toLowerCase() === field.label.toLowerCase() ||
                     header.toLowerCase() === field.key.toLowerCase()
          )

          if (exactMatch) {
            initialMapping[field.key] = exactMatch
          }
        })

        setFieldMapping(initialMapping)
      }
    } catch (error) {
      console.error("Error loading headers from localStorage:", error)
    }
  }, [])

  // Validate mapping - all required fields must be mapped
  useEffect(() => {
    const allRequiredFieldsMapped = REQUIRED_FIELDS.every(
      field => fieldMapping[field.key]
    )
    setIsValid(allRequiredFieldsMapped)
  }, [fieldMapping])

  const handleFieldChange = (fieldKey: string, headerValue: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: headerValue
    }))
  }

  const handleContinue = async () => {
    if (!sessionId) return

    try {
      // Store the field mapping in localStorage
      localStorage.setItem('import_field_mapping', JSON.stringify(fieldMapping))
      localStorage.setItem('import_first_row', String(importFirstRow))

      // Navigate to the validation step
      router.push(`/properties/import/validation?sessionId=${sessionId}`)
    } catch (error) {
      console.error("Error saving field mapping:", error)
      toast({
        title: "Mapping failed",
        description: "There was an error saving your field mapping. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#285755]" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Error</h2>
        <p className="text-gray-600 mb-6">
          There was an error loading your import session. Please try again.
        </p>
        <Button
          onClick={() => router.push("/properties/import/upload")}
          className="gap-2 bg-[#285755] hover:bg-[#285755]/90"
        >
          Return to Upload
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">Fields mapping</h1>
        <p className="text-gray-600 mb-8">
          Map the columns' title with the system requirements.
        </p>

        <div className="mb-4 flex items-center self-start">
          <Checkbox
            id="importFirstRow"
            checked={importFirstRow}
            onCheckedChange={(checked) => setImportFirstRow(checked === true)}
            className="mr-2"
          />
          <Label htmlFor="importFirstRow">
            Import the first row (uncheck if your file has headers)
          </Label>
        </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-2">Required Fields</h3>

            {REQUIRED_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center">
                  <span className="font-medium">{field.label}</span>
                  {!fieldMapping[field.key] && (
                    <X className="h-4 w-4 text-red-500 ml-2" />
                  )}
                </div>
                <Select
                  value={fieldMapping[field.key] || ""}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger className={fieldMapping[field.key] ? "border-green-500" : ""}>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select a column --</SelectItem>
                    {fileHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <h3 className="font-medium text-lg mt-8 mb-2">Optional Fields</h3>

            {OPTIONAL_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                <span className="font-medium">{field.label}</span>
                <Select
                  value={fieldMapping[field.key] || ""}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger className={fieldMapping[field.key] ? "border-green-500" : ""}>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select a column --</SelectItem>
                    {fileHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          onClick={() => router.push(`/properties/import/upload?sessionId=${sessionId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!isValid || updateFieldMapping.isPending}
          className={`gap-2 ${
            isValid ? "bg-[#285755] hover:bg-[#285755]/90" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {updateFieldMapping.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      </div>
    </div>
  )
}
