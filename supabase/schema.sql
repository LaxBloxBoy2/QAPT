-- Create schema for QAPT property management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  is_custom BOOLEAN DEFAULT FALSE
);

-- Insert default roles
INSERT INTO roles (name, is_custom) VALUES 
  ('owner', FALSE),
  ('team_member', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Custom roles table
CREATE TABLE IF NOT EXISTS custom_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
  UNIQUE (owner_id, name)
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  unit_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role assignments table
CREATE TABLE IF NOT EXISTS role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  custom_role_id UUID REFERENCES custom_roles(id) ON DELETE CASCADE,
  CONSTRAINT role_type_check CHECK (
    (role_id IS NOT NULL AND custom_role_id IS NULL) OR
    (role_id IS NULL AND custom_role_id IS NOT NULL)
  ),
  UNIQUE (user_id, property_id)
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  lease_id UUID
);

-- Leases table
CREATE TABLE IF NOT EXISTS leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL,
  CONSTRAINT date_check CHECK (start_date <= end_date)
);

-- Add lease_id foreign key to tenants
ALTER TABLE tenants
ADD CONSTRAINT fk_lease
FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE SET NULL;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  date_paid DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'))
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Roles policies (public read-only)
CREATE POLICY "Roles are viewable by all authenticated users"
  ON roles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Custom roles policies
CREATE POLICY "Owners can manage their custom roles"
  ON custom_roles FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view custom roles"
  ON custom_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      JOIN properties p ON ra.property_id = p.id
      WHERE ra.user_id = auth.uid() AND p.owner_id = custom_roles.owner_id
    )
  );

-- Properties policies
CREATE POLICY "Owners can manage their properties"
  ON properties FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view assigned properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_assignments
      WHERE user_id = auth.uid() AND property_id = properties.id
    )
  );

-- Role assignments policies
CREATE POLICY "Owners can manage role assignments for their properties"
  ON role_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = role_assignments.property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own role assignments"
  ON role_assignments FOR SELECT
  USING (user_id = auth.uid());

-- Tenants policies
CREATE POLICY "Owners can manage tenants for their properties"
  ON tenants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = tenants.property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view tenants for assigned properties"
  ON tenants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.user_id = auth.uid() AND ra.property_id = tenants.property_id
    )
  );

-- Leases policies
CREATE POLICY "Owners can manage leases for their properties"
  ON leases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = leases.property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view leases for assigned properties"
  ON leases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.user_id = auth.uid() AND ra.property_id = leases.property_id
    )
  );

-- Payments policies
CREATE POLICY "Owners can manage payments for their properties"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM leases l
      JOIN properties p ON l.property_id = p.id
      WHERE l.id = payments.lease_id AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view payments for assigned properties"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leases l
      JOIN role_assignments ra ON l.property_id = ra.property_id
      WHERE l.id = payments.lease_id AND ra.user_id = auth.uid()
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
