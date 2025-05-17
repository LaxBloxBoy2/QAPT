import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/lib/user-context"
import { supabase } from "@/lib/supabase"

// Types
interface ImportSession {
  id: string
  organization_id: string
  created_by: string
  file_path: string
  file_name: string
  file_type: string
  file_size: number
  status: 'uploading' | 'mapping' | 'validating' | 'completed' | 'failed'
  entity_type: 'properties'
  total_rows: number
  valid_rows: number
  error_rows: number
  imported_rows: number
  created_at: string
  completed_at: string | null
  file_headers?: string[] // Added by the API
}

interface ImportSessionRow {
  id: string
  session_id: string
  row_number: number
  row_data: Record<string, any>
  field_mapping: Record<string, string> | null
  validation_errors: Record<string, string> | null
  status: 'pending' | 'valid' | 'error' | 'imported'
  created_at: string
  updated_at: string
}

// Create Import Session
export function useCreateImportSession() {
  const { profile } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      entityType
    }: {
      file: File
      entityType: 'properties'
    }) => {
      // Use a default organization ID for testing if profile doesn't have one
      const organizationId = profile?.organization_id || '00000000-0000-0000-0000-000000000000'
      const userId = profile?.user_id || '00000000-0000-0000-0000-000000000000'

      console.log("Using organization ID:", organizationId, "and user ID:", userId);

      // 1. Create an import session
      console.log("Creating import session with profile:", profile);

      const { data: session, error: sessionError } = await supabase
        .from('import_sessions')
        .insert({
          organization_id: organizationId,
          created_by: userId,
          file_path: 'temp', // Will be updated after upload
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          status: 'uploading',
          entity_type: entityType,
          total_rows: 0 // Initialize with 0
        })
        .select('id')
        .single()

      if (sessionError) {
        console.error("Error creating import session:", sessionError);
        throw sessionError;
      }

      // 2. Upload the file using the API endpoint
      try {
        // Create a FormData object to send the file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('sessionId', session.id)

        console.log("Uploading file via API endpoint");

        // Use the API endpoint to upload the file
        const response = await fetch('/api/imports/upload-file', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error from upload API:", errorData);
          throw new Error(errorData.error || 'Failed to upload file')
        }

        const result = await response.json()
        console.log("File uploaded successfully via API:", result);
      } catch (error) {
        console.error("Exception during file upload:", error);
        throw error;
      }

      // 3. Parse the file headers and update the session
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('sessionId', session.id)

        console.log("Parsing file headers");

        const response = await fetch('/api/imports/parse-headers', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error parsing headers:", errorData);
          throw new Error(errorData.error || 'Failed to parse file headers')
        }

        console.log("Headers parsed successfully");
        return session.id
      } catch (error) {
        console.error("Exception during header parsing:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-sessions'] })
    }
  })
}

// Get Import Session
export function useImportSession(sessionId: string | null) {
  const { profile } = useUser()

  return useQuery({
    queryKey: ['import-session', sessionId],
    queryFn: async () => {
      if (!sessionId || !profile?.organization_id) return null

      // Get the session data
      const { data, error } = await supabase
        .from('import_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('organization_id', profile.organization_id)
        .single()

      if (error) throw error

      // Get the file headers if available
      try {
        const response = await fetch(`/api/imports/session-headers?sessionId=${sessionId}`)
        if (response.ok) {
          const { headers } = await response.json()
          return { ...data, file_headers: headers }
        }
      } catch (e) {
        console.error('Error fetching headers:', e)
      }

      return data as ImportSession
    },
    enabled: !!sessionId && !!profile?.organization_id
  })
}

// Get Import Session Rows
export function useImportSessionRows(sessionId: string | null) {
  const { profile } = useUser()

  return useQuery({
    queryKey: ['import-session-rows', sessionId],
    queryFn: async () => {
      if (!sessionId || !profile?.organization_id) return []

      // Get the session rows
      const { data, error } = await supabase
        .from('import_session_rows')
        .select('*')
        .eq('session_id', sessionId)
        .order('row_number', { ascending: true })

      if (error) throw error

      return data as ImportSessionRow[]
    },
    enabled: !!sessionId && !!profile?.organization_id
  })
}

// Update Field Mapping
export function useUpdateFieldMapping() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      fieldMapping,
      importFirstRow
    }: {
      sessionId: string
      fieldMapping: Record<string, string>
      importFirstRow: boolean
    }) => {
      const response = await fetch('/api/imports/update-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          fieldMapping,
          importFirstRow
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update field mapping')
      }

      return await response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['import-session', variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ['import-session-rows', variables.sessionId] })
    }
  })
}

// Update Import Row
export function useUpdateImportRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      rowId,
      rowData
    }: {
      sessionId: string
      rowId: string
      rowData: Record<string, any>
    }) => {
      const response = await fetch('/api/imports/update-row', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          rowId,
          rowData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update row')
      }

      return await response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['import-session-rows', variables.sessionId] })
    }
  })
}

// Import Properties
export function useImportProperties() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      validOnly
    }: {
      sessionId: string
      validOnly: boolean
    }) => {
      const response = await fetch('/api/imports/import-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          validOnly
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to import properties')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    }
  })
}
