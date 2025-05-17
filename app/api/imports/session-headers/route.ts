import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

export async function GET(req: NextRequest) {
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
    
    // Get the session ID from the query params
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    
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
    
    // Parse the file headers
    const fileBuffer = await fileData.arrayBuffer()
    let headers: string[] = []
    
    if (session.file_type === 'text/csv') {
      // Parse CSV
      const content = new TextDecoder().decode(fileBuffer)
      const records = parse(content, {
        columns: false,
        skip_empty_lines: true
      })
      
      if (records.length > 0) {
        headers = records[0]
      }
    } else {
      // Parse Excel
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (data.length > 0) {
        headers = data[0] as string[]
      }
    }
    
    return NextResponse.json({ headers })
  } catch (error) {
    console.error('Error getting session headers:', error)
    return NextResponse.json(
      { error: "Failed to get session headers" },
      { status: 500 }
    )
  }
}
