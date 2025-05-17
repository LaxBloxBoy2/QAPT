import { NextRequest, NextResponse } from "next/server"
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

    // Get the request body
    const body = await req.json()
    const { sessionId, fileName, fileType, fileSize, filePath } = body

    console.log("API: Creating import session with ID:", sessionId)

    // Create the import session
    const { data, error } = await supabase
      .from('import_sessions')
      .insert({
        id: sessionId,
        organization_id: '00000000-0000-0000-0000-000000000000', // Default org ID
        created_by: '00000000-0000-0000-0000-000000000000', // Default user ID
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        status: 'mapping',
        entity_type: 'properties',
        total_rows: 0
      })
      .select('id')
      .single()

    if (error) {
      console.error("API: Error creating import session:", error)
      return NextResponse.json(
        { error: `Failed to create import session: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("API: Import session created successfully:", data)

    return NextResponse.json({
      success: true,
      sessionId: data.id
    })
  } catch (error) {
    console.error('API: Error in create-session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error creating session" },
      { status: 500 }
    )
  }
}
