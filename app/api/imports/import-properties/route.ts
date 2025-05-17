import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    const { sessionId, validOnly } = await req.json()
    
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
    
    // Get the user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()
    
    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }
    
    // Get the import session rows
    const { data: rows, error: rowsError } = await supabase
      .from('import_session_rows')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', validOnly ? 'valid' : 'pending')
      .order('row_number', { ascending: true })
    
    if (rowsError) {
      return NextResponse.json(
        { error: "Failed to get import rows" },
        { status: 500 }
      )
    }
    
    // Import the properties
    let importedCount = 0
    
    for (const row of rows) {
      try {
        // Create the property
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .insert({
            name: row.row_data.name,
            address: row.row_data.address,
            city: row.row_data.city,
            state: row.row_data.state,
            zip: row.row_data.zip,
            property_type: row.row_data.property_type || 'single-family',
            description: row.row_data.description || '',
            status: row.row_data.status || 'active',
            organization_id: userProfile.organization_id,
            created_by: user.id
          })
          .select('id')
          .single()
        
        if (propertyError) {
          console.error('Error creating property:', propertyError)
          continue
        }
        
        // If it's a single-family property, create a default unit
        if (row.row_data.property_type?.toLowerCase() === 'single-family') {
          await supabase
            .from('units')
            .insert({
              property_id: property.id,
              unit_number: 'Main',
              bedrooms: row.row_data.bedrooms || 0,
              bathrooms: row.row_data.bathrooms || 0,
              size: row.row_data.unit_size || 0,
              rent: row.row_data.rent || 0,
              status: 'vacant',
              organization_id: userProfile.organization_id,
              created_by: user.id
            })
        }
        
        // Update the row status
        await supabase
          .from('import_session_rows')
          .update({
            status: 'imported'
          })
          .eq('id', row.id)
        
        importedCount++
      } catch (error) {
        console.error('Error importing property:', error)
      }
    }
    
    // Update the session status
    await supabase
      .from('import_sessions')
      .update({
        status: 'completed',
        imported_rows: importedCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
    
    return NextResponse.json({
      success: true,
      importedCount
    })
  } catch (error) {
    console.error('Error importing properties:', error)
    return NextResponse.json(
      { error: "Failed to import properties" },
      { status: 500 }
    )
  }
}
