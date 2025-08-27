from . import supabase_client
from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Heavy load; consider lazy init

async def process_lr(job_id, lr_id, JOBS):
    JOBS[job_id]['status'] = 'processing'
    supabase_client.supabase.table('extraction_jobs').update({'status':'processing'}).eq('job_id', job_id).execute()
    try:
        lr_res = supabase_client.supabase.table('lorry_receipts').select('*').eq('lr_id', lr_id).execute()
        if not lr_res.data:
            raise RuntimeError('LR missing')
        lr = lr_res.data[0]
        path = lr.get('source_document_path')
        if not path:
            raise RuntimeError('No source_document_path')
        # TODO: Download PDF bytes via storage API and perform real processing
        # Placeholder invoice generation
        inv_number = f"{lr['lr_number']}-INV01"
        supabase_client.supabase.table('invoices').insert({
            'lr_id': lr_id,
            'invoice_number': inv_number,
            'raw_ocr_data': {'stub': True, 'fields': [{'key':'invoice_number','value':inv_number,'confidence':0.99}]}
        }).execute()
        JOBS[job_id]['progress'] = 100
        JOBS[job_id]['status'] = 'completed'
        supabase_client.supabase.table('extraction_jobs').update({'status':'completed','progress':100}).eq('job_id', job_id).execute()
        supabase_client.supabase.table('lorry_receipts').update({'status':'Pending_Validation'}).eq('lr_id', lr_id).execute()
    except Exception as e:
        JOBS[job_id]['status'] = 'failed'
        JOBS[job_id]['error'] = str(e)
        supabase_client.supabase.table('extraction_jobs').update({'status':'failed','error':str(e)}).eq('job_id', job_id).execute()
        supabase_client.supabase.table('lorry_receipts').update({'status':'Extraction_Failed'}).eq('lr_id', lr_id).execute()
