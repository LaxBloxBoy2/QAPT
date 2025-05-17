import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createClientBrowser } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Create a direct Supabase client with the anon key for storage operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClientBrowser(supabaseUrl, supabaseAnonKey)

    // Skip authentication check for now - we'll use the anon key
    console.log("API: Using direct Supabase client for file upload")

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

    console.log("API: Uploading file", file.name, "size:", file.size, "type:", file.type, "for session:", sessionId)

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

    // Upload the file to Supabase Storage
    const filePath = `${sessionId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imports')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error("API: Error uploading file:", uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log("API: File uploaded successfully:", uploadData)

    // Update the session with the file path
    const { error: updateError } = await supabase
      .from('import_sessions')
      .update({ file_path: filePath })
      .eq('id', sessionId)

    if (updateError) {
      console.error("API: Error updating session:", updateError)
      return NextResponse.json(
        { error: `Failed to update session: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      filePath,
      sessionId
    })
  } catch (error) {
    console.error('API: Error in upload-file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error during file upload" },
      { status: 500 }
    )
  }
}
