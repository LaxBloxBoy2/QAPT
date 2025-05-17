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
    const { sessionId } = await req.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID" },
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
    
    // Get the import session rows
    const { data: rows, error: rowsError } = await supabase
      .from('import_session_rows')
      .select('*')
      .eq('session_id', sessionId)
      .order('row_number', { ascending: true })
    
    if (rowsError) {
      return NextResponse.json(
        { error: "Failed to get import rows" },
        { status: 500 }
      )
    }
    
    // Validate each row
    let validCount = 0
    let errorCount = 0
    
    for (const row of rows) {
      const validationErrors: Record<string, string> = {}
      
      // Check required fields
      for (const field of REQUIRED_FIELDS) {
        if (!row.row_data[field] || row.row_data[field].trim() === '') {
          validationErrors[field] = 'Required field'
        }
      }
      
      // Validate property type
      if (row.row_data.property_type && 
          !['single-family', 'multi-family', 'condo', 'apartment', 'townhouse'].includes(row.row_data.property_type.toLowerCase())) {
        validationErrors.property_type = 'Invalid property type'
      }
      
      // Validate numeric fields
      if (row.row_data.bedrooms && isNaN(Number(row.row_data.bedrooms))) {
        validationErrors.bedrooms = 'Must be a number'
      }
      
      if (row.row_data.bathrooms && isNaN(Number(row.row_data.bathrooms))) {
        validationErrors.bathrooms = 'Must be a number'
      }
      
      if (row.row_data.unit_size && isNaN(Number(row.row_data.unit_size))) {
        validationErrors.unit_size = 'Must be a number'
      }
      
      if (row.row_data.rent && isNaN(Number(row.row_data.rent))) {
        validationErrors.rent = 'Must be a number'
      }
      
      // Update the row status
      const hasErrors = Object.keys(validationErrors).length > 0
      const status = hasErrors ? 'error' : 'valid'
      
      // Update the row
      await supabase
        .from('import_session_rows')
        .update({
          validation_errors: hasErrors ? validationErrors : null,
          status
        })
        .eq('id', row.id)
      
      // Update counts
      if (hasErrors) {
        errorCount++
      } else {
        validCount++
      }
    }
    
    // Update the session status
    await supabase
      .from('import_sessions')
      .update({
        status: 'validating',
        valid_rows: validCount,
        error_rows: errorCount
      })
      .eq('id', sessionId)
    
    return NextResponse.json({
      success: true,
      validCount,
      errorCount,
      totalCount: rows.length
    })
  } catch (error) {
    console.error('Error validating rows:', error)
    return NextResponse.json(
      { error: "Failed to validate rows" },
      { status: 500 }
    )
  }
}
