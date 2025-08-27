-- Add extraction_jobs table and extend lorry_receipts status constraint
ALTER TABLE public.lorry_receipts DROP CONSTRAINT IF EXISTS chk_lorry_receipts_status;
ALTER TABLE public.lorry_receipts
  ADD CONSTRAINT chk_lorry_receipts_status CHECK (status IN ('Pending_Validation','Validated','Billed','Processing','Extraction_Failed'));

CREATE TABLE IF NOT EXISTS public.extraction_jobs (
  job_id UUID PRIMARY KEY,
  lr_id INTEGER REFERENCES public.lorry_receipts(lr_id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_extraction_jobs_lr_id ON public.extraction_jobs(lr_id);
