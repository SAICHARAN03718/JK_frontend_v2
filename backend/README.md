Backend OCR & Extraction Service (FastAPI)
=========================================

Purpose: Perform PDF splitting, OCR (PaddleOCR), template-driven field extraction, and persist results to Supabase.

Flow:
1. Frontend uploads PDF to Supabase storage & creates lorry_receipts row.
2. Frontend POST /jobs/lr/{lr_id} to enqueue extraction.
3. Worker downloads PDF (future), splits, OCR, extracts fields, writes invoices, updates statuses.
4. Frontend polls jobs until completed then opens validation modal.

Endpoints:
POST /jobs/lr/{lr_id}
GET /jobs/{job_id}
GET /lr/{lr_id}/invoices
POST /invoice/{invoice_id}/validate
POST /lr/{lr_id}/validate

Install:
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

Env (.env): SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_STORAGE_BUCKET=source_documents

NOTE: processing.py currently stubs OCR and inserts a dummy invoice. Replace with real PDF download & PaddleOCR usage.
