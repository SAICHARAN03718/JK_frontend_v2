from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid, asyncio
from . import supabase_client, processing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

JOBS = {}

class JobCreateResponse(BaseModel):
    job_id: str
    status: str

@app.post('/jobs/lr/{lr_id}', response_model=JobCreateResponse)
async def create_job(lr_id: int):
    job_id = str(uuid.uuid4())
    supabase_client.supabase.table('extraction_jobs').insert({
        'job_id': job_id,
        'lr_id': lr_id,
        'status': 'queued',
        'progress': 0
    }).execute()
    JOBS[job_id] = {'status': 'queued', 'progress': 0, 'lr_id': lr_id, 'error': None}
    supabase_client.supabase.table('lorry_receipts').update({'status': 'Processing'}).eq('lr_id', lr_id).execute()
    asyncio.create_task(processing.process_lr(job_id, lr_id, JOBS))
    return JobCreateResponse(job_id=job_id, status='queued')

@app.get('/jobs/{job_id}')
async def get_job(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        db = supabase_client.supabase.table('extraction_jobs').select('*').eq('job_id', job_id).execute()
        if not db.data:
            raise HTTPException(404, 'Job not found')
        return db.data[0]
    return job

@app.get('/lr/{lr_id}/invoices')
async def get_invoices(lr_id: int):
    res = supabase_client.supabase.table('invoices').select('*').eq('lr_id', lr_id).execute()
    return {'data': res.data}

class InvoiceValidation(BaseModel):
    custom_data: dict

@app.post('/invoice/{invoice_id}/validate')
async def validate_invoice(invoice_id: int, payload: InvoiceValidation):
    supabase_client.supabase.table('invoices').update({'custom_data': payload.custom_data}).eq('invoice_id', invoice_id).execute()
    return {'status': 'ok'}

@app.post('/lr/{lr_id}/validate')
async def validate_lr(lr_id: int):
    inv = supabase_client.supabase.table('invoices').select('invoice_id,custom_data').eq('lr_id', lr_id).execute()
    if not inv.data:
        raise HTTPException(400, 'No invoices to validate')
    all_have = all(i.get('custom_data') for i in inv.data)
    if not all_have:
        raise HTTPException(400, 'Not all invoices validated')
    supabase_client.supabase.table('lorry_receipts').update({'status': 'Validated'}).eq('lr_id', lr_id).execute()
    return {'status': 'validated'}
