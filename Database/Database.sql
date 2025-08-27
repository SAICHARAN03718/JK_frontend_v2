-- =============================================================================
-- FINAL SCHEMA FOR: Logistics & Automated Billing System
-- VERSION: 2.0 (Includes Client Branches and Template Inheritance)
-- =-===========================================================================

-- Drop existing tables in reverse order of dependency to ensure a clean slate
DROP TABLE IF EXISTS public.generated_bill_files;
DROP TABLE IF EXISTS public.invoices;
DROP TABLE IF EXISTS public.lorry_receipts;
DROP TABLE IF EXISTS public.bulk_bills;
DROP TABLE IF EXISTS public.client_field_templates;
DROP TABLE IF EXISTS public.client_branches;
DROP TABLE IF EXISTS public.clients;


-- =============================================================================
-- TABLE 1: clients
-- =============================================================================
-- Stores the master list of your parent client companies.
CREATE TABLE public.clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    address TEXT,
    gstin VARCHAR(15) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.clients IS 'Stores the master list of parent client companies.';


-- =============================================================================
-- TABLE 2: client_branches
-- =============================================================================
-- Stores the details for each unique branch/location of a client.
CREATE TABLE public.client_branches (
    branch_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(client_id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    branch_address TEXT,
    branch_gstin VARCHAR(15) UNIQUE,
    coordinates JSONB
);

COMMENT ON TABLE public.client_branches IS 'Stores each unique location/branch of a client.';
CREATE INDEX idx_client_branches_client_id ON public.client_branches(client_id);
-- Ensure (client_id, branch_id) pairs are unique to support composite FKs
CREATE UNIQUE INDEX ux_client_branches_client_branch ON public.client_branches(client_id, branch_id);


-- =============================================================================
-- TABLE 3: client_field_templates
-- =============================================================================
-- The "Rulebook" for template inheritance. Defines fields for a client
-- and allows specific branches to add or override them.
CREATE TABLE public.client_field_templates (
    field_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(client_id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES public.client_branches(branch_id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_key VARCHAR(50) NOT NULL,
    display_order INTEGER,
    pod_requirement VARCHAR(20) DEFAULT 'NOT_APPLICABLE',
    CONSTRAINT chk_pod_requirement CHECK (pod_requirement IN ('MANDATORY','NOT_APPLICABLE')),
    CONSTRAINT chk_display_order_non_negative CHECK (display_order IS NULL OR display_order >= 0)
);

COMMENT ON TABLE public.client_field_templates IS 'Defines the data fields using an inheritance model.';
COMMENT ON COLUMN public.client_field_templates.branch_id IS 'If NULL, this field is a base template for the client. If set, it''s specific to that branch.';

-- Partial unique indexes to enforce template rules correctly
CREATE UNIQUE INDEX unique_base_template_field ON public.client_field_templates (client_id, field_key) WHERE branch_id IS NULL;
CREATE UNIQUE INDEX unique_branch_template_field ON public.client_field_templates (branch_id, field_key) WHERE branch_id IS NOT NULL;


-- =============================================================================
-- TABLE 4: bulk_bills
-- =============================================================================
CREATE TABLE public.bulk_bills (
    bulk_bill_id SERIAL PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    bill_date DATE NOT NULL,
    client_id INTEGER NOT NULL REFERENCES public.clients(client_id) ON DELETE CASCADE,
    total_freight_amount DECIMAL(12, 2),
    igst_amount DECIMAL(12, 2),
    final_bill_amount DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.bulk_bills IS 'Stores records of generated consolidated bills.';
CREATE INDEX idx_bulk_bills_client_id ON public.bulk_bills(client_id);


-- =============================================================================
-- TABLE 5: lorry_receipts (Trip Header)
-- =============================================================================
CREATE TABLE public.lorry_receipts (
    lr_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(client_id) ON DELETE CASCADE,
    branch_id INTEGER,
    lr_number VARCHAR(100) NOT NULL,
    trip_date DATE NOT NULL,
    vehicle_number VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending_Validation',
    bulk_bill_id INTEGER REFERENCES public.bulk_bills(bulk_bill_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.lorry_receipts IS 'Header table for each trip, linked to a specific client branch.';
CREATE INDEX idx_lorry_receipts_client_id ON public.lorry_receipts(client_id);
CREATE INDEX idx_lorry_receipts_branch_id ON public.lorry_receipts(branch_id);
CREATE INDEX idx_lorry_receipts_status ON public.lorry_receipts(status);
-- Common query helpers
CREATE INDEX idx_lorry_receipts_status_client_date ON public.lorry_receipts(status, client_id, trip_date);
CREATE INDEX idx_lorry_receipts_lr_number ON public.lorry_receipts(lr_number);
-- Enforce valid statuses
ALTER TABLE public.lorry_receipts
    ADD CONSTRAINT chk_lorry_receipts_status
    CHECK (status IN ('Pending_Validation','Validated','Billed'));
-- Prevent duplicate LR per client
CREATE UNIQUE INDEX ux_lorry_receipts_client_lr ON public.lorry_receipts(client_id, lr_number);
-- Ensure branch belongs to client via composite FK
ALTER TABLE public.lorry_receipts
    ADD CONSTRAINT fk_lr_client_branch
    FOREIGN KEY (client_id, branch_id)
    REFERENCES public.client_branches(client_id, branch_id);


-- =============================================================================
-- TABLE 6: invoices (Delivery Details)
-- =============================================================================
CREATE TABLE public.invoices (
    invoice_id SERIAL PRIMARY KEY,
    lr_id INTEGER NOT NULL REFERENCES public.lorry_receipts(lr_id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    raw_ocr_data JSONB,
    custom_data JSONB,
    invoice_page_ref VARCHAR(255),
    pod_page_ref VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.invoices IS 'Stores details for each delivery (Invoice-POD pair) within a trip.';
CREATE INDEX idx_invoices_lr_id ON public.invoices(lr_id);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
-- JSONB search acceleration
CREATE INDEX idx_invoices_raw_ocr_data_gin ON public.invoices USING GIN (raw_ocr_data);
CREATE INDEX idx_invoices_custom_data_gin ON public.invoices USING GIN (custom_data);
-- Prevent duplicate invoice per LR
CREATE UNIQUE INDEX ux_invoices_lr_invoice ON public.invoices(lr_id, invoice_number);


-- =============================================================================
-- TABLE 7: generated_bill_files
-- =============================================================================
CREATE TABLE public.generated_bill_files (
    file_id SERIAL PRIMARY KEY,
    bulk_bill_id INTEGER NOT NULL REFERENCES public.bulk_bills(bulk_bill_id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_size_kb INTEGER,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.generated_bill_files IS 'Archives every generated Excel bill file.';
CREATE INDEX idx_generated_bill_files_bulk_bill_id ON public.generated_bill_files(bulk_bill_id);
CREATE UNIQUE INDEX ux_generated_bill_files_file_path ON public.generated_bill_files(file_path);


-- =============================================================================
-- ROW-LEVEL SECURITY (RLS) SETUP FOR SUPABASE
-- =============================================================================
-- Enable RLS on all tables as a security best practice.
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_field_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lorry_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_bill_files ENABLE ROW LEVEL SECURITY;

-- Create default policies to allow access for authenticated users.
-- In a production multi-user environment, you would create more restrictive policies.
CREATE POLICY "Allow all access to authenticated users" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.client_branches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.client_field_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.bulk_bills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.lorry_receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.generated_bill_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- DATA VALIDATION CHECKS
-- =============================================================================
-- Basic GSTIN format check (15 uppercase alphanumeric characters)
ALTER TABLE public.clients
    ADD CONSTRAINT chk_clients_gstin_format
    CHECK (gstin IS NULL OR gstin ~ '^[0-9A-Z]{15}$');

-- =============================================================================
-- TRIGGERS: AUTOMATIC updated_at STAMPS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS trg_set_updated_at_lorry_receipts ON public.lorry_receipts;
CREATE TRIGGER trg_set_updated_at_lorry_receipts
BEFORE UPDATE ON public.lorry_receipts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_invoices ON public.invoices;
CREATE TRIGGER trg_set_updated_at_invoices
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_bulk_bills ON public.bulk_bills;
CREATE TRIGGER trg_set_updated_at_bulk_bills
BEFORE UPDATE ON public.bulk_bills
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- MANUAL STEP: SUPABASE STORAGE
-- =============================================================================
-- Remember to create a PRIVATE bucket in your Supabase Storage,
-- for example, named "generated_bills". The `file_path` column in the
-- `generated_bill_files` table will store the reference to the objects
-- uploaded to this bucket.
-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
