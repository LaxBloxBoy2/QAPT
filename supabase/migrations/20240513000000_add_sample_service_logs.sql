-- Add sample service logs for testing
DO $$
DECLARE
    appliance_id UUID := 'b653fe6a-377a-4b0f-a031-473e0c5e964f'; -- Replace with your actual appliance ID
    user_id UUID;
    org_id UUID := '11111111-1111-1111-1111-111111111111'; -- This is the sample organization ID
BEGIN
    -- Get a valid user ID
    SELECT id INTO user_id FROM user_profiles LIMIT 1;
    
    -- Insert sample service logs
    INSERT INTO appliance_service_logs (
        appliance_id, 
        service_date, 
        service_type, 
        description, 
        cost, 
        provider_name, 
        created_by, 
        organization_id
    ) VALUES 
    (
        appliance_id,
        '2023-12-15',
        'maintenance',
        'Regular maintenance check and filter replacement',
        75.99,
        'ABC Maintenance Co.',
        user_id,
        org_id
    ),
    (
        appliance_id,
        '2023-09-05',
        'repair',
        'Fixed leaking water connection',
        129.50,
        'Quick Fix Plumbing',
        user_id,
        org_id
    ),
    (
        appliance_id,
        '2023-06-20',
        'inspection',
        'Annual safety inspection',
        50.00,
        'Safety First Inspections',
        user_id,
        org_id
    );
END $$;
