import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdir } from 'fs/promises'

// Create uploads directory if it doesn't exist
const ensureUploadsDir = async () => {
  const uploadsDir = path.join(process.cwd(), 'uploads')
  try {
    await mkdir(uploadsDir, { recursive: true })
    return uploadsDir
  } catch (error) {
    console.error('Error creating uploads directory:', error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    console.log("API: Creating admin Supabase client for simple upload")
    
    // Create admin client that bypasses RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      )
    }
    
    // Generate a unique file path
    const uniqueId = crypto.randomUUID()
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${uniqueId}_${fileName}`
    
    console.log("API: Processing file:", fileName, "size:", file.size, "type:", file.type)
    
    // Save file to local filesystem instead of Supabase Storage
    try {
      const uploadsDir = await ensureUploadsDir()
      const localFilePath = path.join(uploadsDir, filePath)
      
      // Convert file to buffer and save locally
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      await writeFile(localFilePath, buffer)
      console.log("API: File saved locally to:", localFilePath)
      
      // Parse file headers
      let headers: string[] = []
      let rowCount = 0
      
      if (file.type === 'text/csv') {
        // Parse CSV
        const content = buffer.toString('utf-8')
        const records = parse(content, {
          columns: false,
          skip_empty_lines: true
        })
        
        rowCount = records.length
        console.log(`API: CSV parsed with ${rowCount} rows`)
        
        if (records.length > 0) {
          headers = records[0].map(String)
        }
      } else {
        // Parse Excel
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        rowCount = data.length
        console.log(`API: Excel parsed with ${rowCount} rows`)
        
        if (data.length > 0) {
          headers = (data[0] as any[]).map(String)
        }
      }
      
      // Create an import session
      const { data: session, error: sessionError } = await supabase
        .from('import_sessions')
        .insert({
          organization_id: '00000000-0000-0000-0000-000000000000', // Default org ID
          created_by: '00000000-0000-0000-0000-000000000000', // Default user ID
          file_path: localFilePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          status: 'mapping',
          entity_type: 'properties',
          total_rows: Math.max(0, rowCount - 1) // Subtract 1 for header row
        })
        .select('id')
        .single()
      
      if (sessionError) {
        console.error("API: Error creating import session:", sessionError)
        return NextResponse.json(
          { error: `Session creation failed: ${sessionError.message}` },
          { status: 500 }
        )
      }
      
      console.log("API: Import session created successfully:", session)
      
      return NextResponse.json({ 
        success: true,
        sessionId: session.id,
        headers,
        rowCount: Math.max(0, rowCount - 1)
      })
    } catch (error) {
      console.error("API: Error processing file:", error)
      return NextResponse.json(
        { error: `File processing error: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API: Error in simple-upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error during upload" },
      { status: 500 }
    )
  }
}
