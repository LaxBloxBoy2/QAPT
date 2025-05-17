import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Required fields for property import
const REQUIRED_FIELDS = [
  "name",
  "address",
  "city",
  "state",
  "zip",
  "property_type"
]

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get the request body
    const { sessionId, rowId, rowData } = await req.json()
    
    if (!sessionId || !rowId || !rowData) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }
    
    // Get the session to verify ownership
    const { data: session, error: sessionError } = await supabase
      .from('import_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }
    
    // Validate the row data
    const validationErrors: Record<string, string> = {}
    
    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!rowData[field] || rowData[field].trim() === '') {
        validationErrors[field] = 'Required field'
      }
    }
    
    // Validate property type
    if (rowData.property_type && 
        !['single-family', 'multi-family', 'condo', 'apartment', 'townhouse'].includes(rowData.property_type.toLowerCase())) {
      validationErrors.property_type = 'Invalid property type'
    }
    
    // Validate numeric fields
    if (rowData.bedrooms && isNaN(Number(rowData.bedrooms))) {
      validationErrors.bedrooms = 'Must be a number'
    }
    
    if (rowData.bathrooms && isNaN(Number(rowData.bathrooms))) {
      validationErrors.bathrooms = 'Must be a number'
    }
    
    if (rowData.unit_size && isNaN(Number(rowData.unit_size))) {
      validationErrors.unit_size = 'Must be a number'
    }
    
    if (rowData.rent && isNaN(Number(rowData.rent))) {
      validationErrors.rent = 'Must be a number'
    }
    
    // Update the row status
    const hasErrors = Object.keys(validationErrors).length > 0
    const status = hasErrors ? 'error' : 'valid'
    
    // Update the row
    const { error: updateError } = await supabase
      .from('import_session_rows')
      .update({
        row_data: rowData,
        validation_errors: hasErrors ? validationErrors : null,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', rowId)
      .eq('session_id', sessionId)
    
    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update row" },
        { status: 500 }
      )
    }
    
    // Update the session stats
    const { data: rows, error: rowsError } = await supabase
      .from('import_session_rows')
      .select('status')
      .eq('session_id', sessionId)
    
    if (!rowsError && rows) {
      const validCount = rows.filter(r => r.status === 'valid').length
      const errorCount = rows.filter(r => r.status === 'error').length
      
      await supabase
        .from('import_sessions')
        .update({
          valid_rows: validCount,
          error_rows: errorCount
        })
        .eq('id', sessionId)
    }
    
    return NextResponse.json({
      success: true,
      hasErrors,
      status
    })
  } catch (error) {
    console.error('Error updating row:', error)
    return NextResponse.json(
      { error: "Failed to update row" },
      { status: 500 }
    )
  }
}
