-- Drop existing RLS policies for import_sessions
DROP POLICY IF EXISTS "Users can view import sessions in their organization" ON import_sessions;
DROP POLICY IF EXISTS "Users can insert import sessions for their organization" ON import_sessions;
DROP POLICY IF EXISTS "Users can update import sessions in their organization" ON import_sessions;
DROP POLICY IF EXISTS "Users can delete import sessions in their organization" ON import_sessions;

-- Create more permissive RLS policies for import_sessions
CREATE POLICY "Anyone can view import sessions"
  ON import_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert import sessions"
  ON import_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update import sessions"
  ON import_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete import sessions"
  ON import_sessions FOR DELETE
  USING (true);

-- Drop existing RLS policies for import_session_rows
DROP POLICY IF EXISTS "Users can view import session rows in their organization" ON import_session_rows;
DROP POLICY IF EXISTS "Users can insert import session rows in their organization" ON import_session_rows;
DROP POLICY IF EXISTS "Users can update import session rows in their organization" ON import_session_rows;
DROP POLICY IF EXISTS "Users can delete import session rows in their organization" ON import_session_rows;

-- Create more permissive RLS policies for import_session_rows
CREATE POLICY "Anyone can view import session rows"
  ON import_session_rows FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert import session rows"
  ON import_session_rows FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update import session rows"
  ON import_session_rows FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete import session rows"
  ON import_session_rows FOR DELETE
  USING (true);
