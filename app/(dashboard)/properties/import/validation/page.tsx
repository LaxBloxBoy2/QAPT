"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, AlertTriangle, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useImportSession,
  useImportSessionRows,
  useUpdateImportRow,
  useImportProperties
} from "@/lib/hooks/use-imports"

export default function ValidationStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const sessionId = searchParams.get("sessionId")

  const { data: session, isLoading: sessionLoading } = useImportSession(sessionId)
  const { data: rows, isLoading: rowsLoading } = useImportSessionRows(sessionId)
  const updateImportRow = useUpdateImportRow()
  const importProperties = useImportProperties()

  const [editingRow, setEditingRow] = useState<any>(null)
  const [editedValues, setEditedValues] = useState<Record<string, any>>({})
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  // Stats
  const validRows = rows?.filter(row => row.status === 'valid').length || 0
  const errorRows = rows?.filter(row => row.status === 'error').length || 0
  const totalRows = rows?.length || 0

  const handleEditRow = (row: any) => {
    setEditingRow(row)
    setEditedValues(row.row_data)
    setIsEditSheetOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRow || !sessionId) return

    try {
      await updateImportRow.mutateAsync({
        sessionId,
        rowId: editingRow.id,
        rowData: editedValues
      })

      setIsEditSheetOpen(false)
      toast({
        title: "Row updated",
        description: "The row has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating row:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the row. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleImport = async (validOnly: boolean) => {
    if (!sessionId) return

    try {
      await importProperties.mutateAsync({
        sessionId,
        validOnly
      })

      toast({
        title: "Import successful",
        description: `${validOnly ? validRows : totalRows} properties have been imported successfully.`,
      })

      // Navigate back to properties page
      router.push("/properties")
    } catch (error) {
      console.error("Error importing properties:", error)
      toast({
        title: "Import failed",
        description: "There was an error importing the properties. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (sessionLoading || rowsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#285755]" />
      </div>
    )
  }

  if (!session || !rows) {
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
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Validation errors</h1>

        <div className="flex items-center gap-4 mb-6 self-start">
          <div className="flex items-center gap-1">
            <span className="font-medium">Valid:</span>
            <span className="text-green-600 font-medium">{validRows}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Errors detected:</span>
            <span className="text-red-600 font-medium">{errorRows}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Validated:</span>
            <span className="font-medium">{totalRows} of {totalRows}</span>
          </div>
        </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Street</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.row_number}</TableCell>
                    <TableCell>
                      {row.status === 'valid' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Valid</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <X className="h-4 w-4 mr-1" />
                          <span>Error</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{row.row_data.name}</TableCell>
                    <TableCell>{row.row_data.address}</TableCell>
                    <TableCell>{row.row_data.city}</TableCell>
                    <TableCell>{row.row_data.rent || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRow(row)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {errorRows > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">
              There are {errorRows} rows with validation errors
            </p>
            <p className="text-amber-700 text-sm">
              You need to fix all errors before importing, or choose to import only valid rows.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          onClick={() => router.push(`/properties/import/mapping?sessionId=${sessionId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="space-x-3">
          {validRows > 0 && errorRows > 0 && (
            <Button
              variant="outline"
              onClick={() => handleImport(true)}
              disabled={importProperties.isPending}
              className="gap-2"
            >
              {importProperties.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Import valid only ({validRows})</>
              )}
            </Button>
          )}

          <Button
            onClick={() => handleImport(false)}
            disabled={errorRows > 0 || importProperties.isPending}
            className={`gap-2 ${
              errorRows === 0 ? "bg-[#285755] hover:bg-[#285755]/90" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {importProperties.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Import</>
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>

      {/* Edit Row Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Row #{editingRow?.row_number}</SheetTitle>
            <SheetDescription>
              Make changes to fix validation errors.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {editingRow && (
              <>
                {Object.entries(editingRow.row_data).map(([key, value]) => {
                  const hasError = editingRow.validation_errors?.[key]

                  return (
                    <div key={key} className="space-y-1">
                      <Label
                        htmlFor={key}
                        className={hasError ? "text-red-500" : ""}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {hasError && (
                          <span className="ml-2 text-xs text-red-500">
                            ({hasError})
                          </span>
                        )}
                      </Label>
                      <Input
                        id={key}
                        value={editedValues[key] || ""}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className={hasError ? "border-red-500" : ""}
                      />
                    </div>
                  )
                })}

                <div className="pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={updateImportRow.isPending}
                    className="w-full bg-[#285755] hover:bg-[#285755]/90"
                  >
                    {updateImportRow.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
