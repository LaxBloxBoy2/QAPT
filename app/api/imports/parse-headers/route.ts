import { NextRequest, NextResponse } from "next/server"
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase credentials for testing
const SUPABASE_URL = "https://wowmsuvnokexqyuksweh.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvd21zdXZub2t4cXl1a3N3ZWgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0NjkyODAwOSwiZXhwIjoyMDYyNTA0MDA5fQ.k64s1Gk57Cy5QzshqQ4a1obFEIslfH4ayTzxSiKI61k"

export async function POST(req: NextRequest) {
  try {
    // Create a Supabase client with hardcoded credentials
    console.log("API: Creating Supabase client with hardcoded credentials")

    // Create client with hardcoded credentials
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const sessionId = formData.get('sessionId') as string

    if (!file || !sessionId) {
      return NextResponse.json(
        { error: "Missing file or session ID" },
        { status: 400 }
      )
    }

    // Get the session - don't verify ownership for now
    const { data: session, error: sessionError } = await supabase
      .from('import_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError) {
      console.error("API: Error fetching session:", sessionError)

      // Continue anyway - we'll use the session ID directly
      console.log("API: Continuing with session ID:", sessionId)
    } else {
      console.log("API: Found session:", session)
    }

    // Parse the file headers
    console.log("API: Parsing headers for file:", file.name, "type:", file.type);

    try {
      const fileBuffer = await file.arrayBuffer()
      let headers: string[] = []
      let rowCount = 0

      if (file.type === 'text/csv') {
        // Parse CSV
        const content = new TextDecoder().decode(fileBuffer)
        const records = parse(content, {
          columns: false,
          skip_empty_lines: true
        })

        rowCount = records.length
        console.log(`API: CSV parsed with ${rowCount} rows`);

        if (records.length > 0) {
          headers = records[0].map(String)
        }
      } else {
        // Parse Excel
        const workbook = XLSX.read(fileBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        rowCount = data.length
        console.log(`API: Excel parsed with ${rowCount} rows`);

        if (data.length > 0) {
          headers = (data[0] as any[]).map(String)
        }
      }

      console.log("API: Headers parsed:", headers);

      // Update the session with the row count
      await supabase
        .from('import_sessions')
        .update({
          total_rows: Math.max(0, rowCount - 1) // Subtract 1 for header row
        })
        .eq('id', sessionId)
    } catch (error) {
      console.error("API: Error parsing file:", error);
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    try {
      // Update the session status
      const { error: updateError } = await supabase
        .from('import_sessions')
        .update({
          status: 'mapping',
          total_rows: 0 // Will be updated in the next step
        })
        .eq('id', sessionId)

      if (updateError) {
        console.error("API: Error updating session status:", updateError)
      } else {
        console.log("API: Session status updated to 'mapping'")
      }
    } catch (error) {
      console.error("API: Exception updating session status:", error)
      // Continue anyway
    }

    // Store the headers in a temporary table or cache
    // For simplicity, we'll return them directly here
    return NextResponse.json({ headers })
  } catch (error) {
    console.error('API: Error in parse-headers endpoint:', error)
    return NextResponse.json(
      {
        error: error instanceof Error
          ? `Failed to parse file headers: ${error.message}`
          : "Failed to parse file headers"
      },
      { status: 500 }
    )
  }
}
