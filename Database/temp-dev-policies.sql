-- Temporary Development RLS Policies
-- Run this in your Supabase SQL Editor to allow anonymous access for development

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.client_branches;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.client_field_templates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.bulk_bills;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.lorry_receipts;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.invoices;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.generated_bill_files;

-- Create development policies that allow anonymous access
CREATE POLICY "Allow all access for development" ON public.clients FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.client_branches FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.client_field_templates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.bulk_bills FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.lorry_receipts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.invoices FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON public.generated_bill_files FOR ALL TO anon USING (true) WITH CHECK (true);

-- Also create policies for authenticated users (backup)
CREATE POLICY "Allow all access to authenticated users" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.client_branches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.client_field_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.bulk_bills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.lorry_receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON public.generated_bill_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
