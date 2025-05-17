-- Create imports storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imports',
  'imports',
  false, -- Not public, access controlled via RLS
  10000000, -- 10MB limit
  '{text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet}'
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create import_sessions table
CREATE TABLE IF NOT EXISTS import_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('uploading', 'mapping', 'validating', 'completed', 'failed')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('properties')),
  total_rows INTEGER,
  valid_rows INTEGER DEFAULT 0,
  error_rows INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create import_session_rows table
CREATE TABLE IF NOT EXISTS import_session_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES import_sessions(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  row_data JSONB NOT NULL,
  field_mapping JSONB,
  validation_errors JSONB,
  status TEXT NOT NULL CHECK (status IN ('pending', 'valid', 'error', 'imported')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_import_sessions_organization ON import_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_import_sessions_status ON import_sessions(status);
CREATE INDEX IF NOT EXISTS idx_import_session_rows_session ON import_session_rows(session_id);
CREATE INDEX IF NOT EXISTS idx_import_session_rows_status ON import_session_rows(status);

-- Set up Row Level Security (RLS)
ALTER TABLE import_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_session_rows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for import_sessions
CREATE POLICY "Users can view import sessions in their organization"
  ON import_sessions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert import sessions for their organization"
  ON import_sessions FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update import sessions in their organization"
  ON import_sessions FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete import sessions in their organization"
  ON import_sessions FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
  ));

-- Create RLS policies for import_session_rows
CREATE POLICY "Users can view import session rows in their organization"
  ON import_session_rows FOR SELECT
  USING (session_id IN (
    SELECT id FROM import_sessions WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert import session rows for their organization"
  ON import_session_rows FOR INSERT
  WITH CHECK (session_id IN (
    SELECT id FROM import_sessions WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update import session rows in their organization"
  ON import_session_rows FOR UPDATE
  USING (session_id IN (
    SELECT id FROM import_sessions WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete import session rows in their organization"
  ON import_session_rows FOR DELETE
  USING (session_id IN (
    SELECT id FROM import_sessions WHERE organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  ));

-- Create storage policies for imports bucket
CREATE POLICY "Anyone can upload to imports bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imports'
  );

CREATE POLICY "Anyone can view imports bucket"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'imports'
  );

CREATE POLICY "Anyone can delete from imports bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'imports'
  );
