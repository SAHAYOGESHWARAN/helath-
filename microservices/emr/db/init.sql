CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url VARCHAR(255),
    phone_number VARCHAR(20),
    address JSONB,
    date_of_birth DATE,
    gender VARCHAR(10),
    insurance JSONB,
    health_goals JSONB,
    tasks JSONB,
    conditions JSONB,
    allergies JSONB,
    subscription JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    provider_id UUID NOT NULL REFERENCES users(id),
    provider_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    reason TEXT,
    location VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL,
    check_in_status VARCHAR(50),
    visit_summary TEXT,
    video_updates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    claim_type VARCHAR(50) NOT NULL,
    total_claim_charge_amount NUMERIC(10, 2) NOT NULL,
    patient_owes NUMERIC(10, 2) NOT NULL,
    insurance_paid NUMERIC(10, 2) NOT NULL,
    line_items JSONB,
    denial_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_due NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    provider_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    drug VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    refills INTEGER NOT NULL,
    pharmacy VARCHAR(255) NOT NULL,
    date_prescribed DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    provider_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    tests JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    referred_to VARCHAR(255) NOT NULL,
    referred_from VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_date DATE,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    urgency VARCHAR(50) NOT NULL,
    attachments JSONB,
    audit_log JSONB
);

CREATE TABLE IF NOT EXISTS migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_name VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


