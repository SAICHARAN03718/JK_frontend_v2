-- Migration: Add source_document_path to lorry_receipts
ALTER TABLE public.lorry_receipts
  ADD COLUMN IF NOT EXISTS source_document_path TEXT;

-- Optional: index if querying frequently by path
CREATE INDEX IF NOT EXISTS idx_lorry_receipts_source_document_path ON public.lorry_receipts(source_document_path);
