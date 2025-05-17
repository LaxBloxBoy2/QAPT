import { NextRequest, NextResponse } from "next/server"
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

export async function POST(req: NextRequest) {
  try {
    console.log("API: Processing direct upload request")

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
    const filePath = `direct_${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    console.log("API: Uploading file to path:", filePath)

    // Parse the file to get headers and row count
    let headers: string[] = []
    let rowCount = 0

    try {
      // Convert file to buffer for parsing
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

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
    } catch (error) {
      console.error("API: Error parsing file:", error)
      return NextResponse.json(
        { error: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 }
      )
    }

    // Generate a session ID
    const sessionId = crypto.randomUUID()
    console.log("API: Generated session ID:", sessionId)

    return NextResponse.json({
      success: true,
      sessionId,
      headers,
      rowCount: Math.max(0, rowCount - 1)
    })
  } catch (error) {
    console.error('API: Error in direct-upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error during upload" },
      { status: 500 }
    )
  }
}
