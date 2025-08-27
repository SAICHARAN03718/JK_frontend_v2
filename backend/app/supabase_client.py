import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SERVICE_KEY:
    raise RuntimeError('Supabase credentials missing')

supabase: Client = create_client(SUPABASE_URL, SERVICE_KEY)
