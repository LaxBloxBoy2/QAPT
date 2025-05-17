import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

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
    const { sessionId, fieldMapping, importFirstRow } = await req.json()
    
    if (!sessionId || !fieldMapping) {
      return NextResponse.json(
        { error: "Missing session ID or field mapping" },
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
    
    // Get the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('imports')
      .download(session.file_path)
    
    if (fileError || !fileData) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      )
    }
    
    // Parse the file data
    const fileBuffer = await fileData.arrayBuffer()
    let rows: any[] = []
    
    if (session.file_type === 'text/csv') {
      // Parse CSV
      const content = new TextDecoder().decode(fileBuffer)
      rows = parse(content, {
        columns: false,
        skip_empty_lines: true
      })
    } else {
      // Parse Excel
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    }
    
    // Skip the header row if not importing it
    const dataRows = importFirstRow ? rows : rows.slice(1)
    
    // Validate the number of rows
    if (dataRows.length > 500) {
      return NextResponse.json(
        { error: "Too many rows. Maximum 500 rows allowed." },
        { status: 400 }
      )
    }
    
    // Get the headers
    const headers = rows[0]
    
    // Create the import session rows
    const importRows = dataRows.map((row, index) => {
      // Map the row data using the field mapping
      const rowData: Record<string, any> = {}
      
      Object.entries(fieldMapping).forEach(([fieldKey, headerValue]) => {
        if (headerValue) {
          const headerIndex = headers.indexOf(headerValue)
          if (headerIndex !== -1) {
            rowData[fieldKey] = row[headerIndex] || ''
          }
        }
      })
      
      return {
        session_id: sessionId,
        row_number: index + 1,
        row_data: rowData,
        field_mapping: fieldMapping,
        status: 'pending'
      }
    })
    
    // Insert the import session rows
    const { error: insertError } = await supabase
      .from('import_session_rows')
      .insert(importRows)
    
    if (insertError) {
      return NextResponse.json(
        { error: "Failed to insert import rows" },
        { status: 500 }
      )
    }
    
    // Update the session status
    await supabase
      .from('import_sessions')
      .update({
        status: 'validating',
        total_rows: dataRows.length
      })
      .eq('id', sessionId)
    
    // Validate the rows
    const response = await fetch(`${req.nextUrl.origin}/api/imports/validate-rows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to validate rows" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating mapping:', error)
    return NextResponse.json(
      { error: "Failed to update mapping" },
      { status: 500 }
    )
  }
}
