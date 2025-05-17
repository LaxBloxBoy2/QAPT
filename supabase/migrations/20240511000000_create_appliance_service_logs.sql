-- Create appliance_service_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS appliance_service_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appliance_id UUID NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('maintenance', 'repair', 'inspection', 'replacement', 'other')),
  description TEXT NOT NULL,
  cost DECIMAL(10, 2),
  provider_name TEXT,
  attachment_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appliance_service_logs_appliance ON appliance_service_logs(appliance_id);
CREATE INDEX IF NOT EXISTS idx_appliance_service_logs_organization ON appliance_service_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_appliance_service_logs_date ON appliance_service_logs(service_date);

-- Set up Row Level Security (RLS)
ALTER TABLE appliance_service_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view service logs in their organization
CREATE POLICY "Users can view appliance service logs in their organization"
  ON appliance_service_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Users can insert service logs in their organization
CREATE POLICY "Users can insert appliance service logs in their organization"
  ON appliance_service_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Users can update service logs in their organization
CREATE POLICY "Users can update appliance service logs in their organization"
  ON appliance_service_logs
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Users can delete service logs in their organization
CREATE POLICY "Users can delete appliance service logs in their organization"
  ON appliance_service_logs
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );